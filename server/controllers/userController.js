import Course from "../model/Course.js";
import { Purchase } from "../model/Purchase.js";
import User from "../model/User.js";
import Stripe from 'stripe'
export const getUserById = async( req,res)=>{
  try{
    const userId = req.auth.userId;
    const userData = await User.findById(userId);
    if(!userData){
      return res.json({success:false,message:'User not found'})
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
      res.json({success:false,message:'Data not found'});
    }
    const PurchaseData = {
      courseId:courseData._id,
      userId,
      amount:(courseData.coursePrice-courseData.discount*courseData.coursePrice/100).toFixed(2),
    }
    const newPurchase = await Purchase.create(PurchaseData)
    //stripe gateway init
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)
    const currency = process.env.CURRENCY.tolowerCase()
    
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