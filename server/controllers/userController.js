import Course from "../model/Course.js";
import { CourseProgress } from "../model/CourseProgress.js";
import { Purchase } from "../model/Purchase.js";
import User from "../model/User.js";
import Stripe from 'stripe'
import { clerkClient } from '@clerk/express'

export const getUserById = async( req,res)=>{
  try{
    const userId = req.auth.userId;
    if(!userId){
      return res.json({success:false,message:'User not authenticated'})
    }
    let userData = await User.findById(userId);
    if(!userData){
      // Auto-create user from Clerk data (handles missing webhook scenario)
      const clerkUser = await clerkClient.users.getUser(userId);
      userData = await User.create({
        _id: userId,
        email: clerkUser.emailAddresses[0].emailAddress,
        name: (clerkUser.firstName || '') + ' ' + (clerkUser.lastName || ''),
        imageUrl: clerkUser.imageUrl,
      });
    }
    res.json({success:true,userData})
  }
  catch(error){
    res.json({success:false,message:error.message})
  }
}

export const userEnrolledCourses = async(req,res)=>{
  try{
    const userId = req.auth.userId;
    const userData = await User.findById(userId).populate('enrolledCourses');
    if(!userData){
      return res.json({success:false,message:'User not found'})
    }
    res.json({success:true,enrolledCourses:userData.enrolledCourses});
  }
  catch(error){
    res.json({success:false,message:error.message})
  }
}
export const purchaseCourse = async (req,res)=>{
  try {
    const {courseId} = req.body;
    const {origin} = req.headers
    const userId = req.auth.userId
    const userData = await User.findById(userId);
    const courseData = await Course.findById(courseId)
    if(!userData || !courseData) {
      return res.json({success:false,message:'Data not found'});
    }
    const PurchaseData = {
      courseId:courseData._id,
      userId,
      amount:(courseData.coursePrice-courseData.discount*courseData.coursePrice/100).toFixed(2),
    }
    const newPurchase = await Purchase.create(PurchaseData)
    //stripe gateway init
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)
    const currency = process.env.CURRENCY.toLowerCase()
    
    // creating line item for stripe checkout seession
    const lineItem = [{
      price_data:{
        currency,
        product_data:{
          name:courseData.courseTitle,
          description:courseData.courseDescription, 
        },
        unit_amount:Math.round(newPurchase.amount*100)
      },
      quantity:1
      }
    ] 
    const session = await stripeInstance.checkout.sessions.create({
      success_url:`${origin}/loading/my-enrollments`,
      cancel_url:`${origin}/`,
      line_items:lineItem,
      mode:'payment',
      metadata:{
        purchaseId:newPurchase._id.toString(),
        userId,
      }
    })
    res.json({success:true,session_url:session.url})
  } catch (error) {
    res.json({success:false,message:error.message})
  }
}

// update user course progress
export const updateUserCourseProgress = async(req,res)=>{
  try {
    const userId = req.auth.userId;
    const {courseId,lectureId} = req.body
    const progressData = await CourseProgress.findOne({userId, courseId})

    if(progressData){
      if(progressData.lectureCompleted.includes(lectureId)){
        return res.json({success:true,message:'Lecture Already Completed'})
      }
      progressData.lectureCompleted.push(lectureId)
      await progressData.save()
    }
    else{
      await CourseProgress.create({
        userId,
        courseId,
        lectureCompleted:[lectureId]
      })
    }
    res.json({success:true, message:'Progess Updated'})
  } catch (error) {
    res.json({success:false,message:error.message});
  }
}
// user progress
export const getUserCourseProgress = async(req,res)=>{
  try {
    const userId = req.auth.userId
    const {courseId} = req.body
    const progressData = await CourseProgress.findOne({userId,courseId})
    res.json({success:true,progressData})
  } catch (error) {
    res.json({success:false,message:error.message})
  }
}

// Add user Rating to Course

export const addUserRating = async(req,res)=>{
  const userId = req.auth.userId
  const {courseId,rating} = req.body

  if(!courseId || !userId || !rating || rating <1 || rating>5){
    return res.json({success:false,message:'Invalid Details'})
  }
  try {
    const course = await Course.findById(courseId);
    if(!course){
      return res.json({success:false,message:'Course not found.'})
    }
    const user = await User.findById(userId);
    if(!user || !user.enrolledCourses.includes(courseId)){
      return res.json({success:false,message:'User has not purchased the course.'})
    }
    const existingRatingIndex = course.courseRating.findIndex(r=> r.userId === userId)
    if(existingRatingIndex>-1){
      course.courseRating[existingRatingIndex].rating = rating;
    }
    else{
      course.courseRating.push({userId,rating});
    }
    await course.save();
    return res.json({success:true,message:'Rating added'});
  } catch (error) {
    res.json({success:false,message:error.message})
  }
}