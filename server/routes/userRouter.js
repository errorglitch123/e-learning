import express from 'express'
import { addUserRating, getUserById, getUserCourseProgress, purchaseCourse, updateUserCourseProgress, userEnrolledCourses, verifyStripePurchase } from '../controllers/userController.js';
import { requireAuth } from '@clerk/express';

const userRouter = express.Router();
userRouter.get('/data', requireAuth(), getUserById);
userRouter.get('/enrolled-courses', requireAuth(), userEnrolledCourses);
userRouter.post('/purchase', requireAuth(), purchaseCourse);
userRouter.post('/update-course-progress', requireAuth(), updateUserCourseProgress)
userRouter.post('/get-course-progress', requireAuth(), getUserCourseProgress)
userRouter.post('/add-rating', requireAuth(), addUserRating)
userRouter.post('/verify-stripe', requireAuth(), verifyStripePurchase)
export default userRouter;