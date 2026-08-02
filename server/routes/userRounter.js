import express from 'express'
import { addUserRating, getUserById, getUserCourseProgess, purchaseCourse, updateUserCourseProgress, userEnrolledCourses } from '../controllers/userController';

const userRouter = express.Router();
userRouter.get('/data',getUserById);
userRouter.get('/enrolled-courses',userEnrolledCourses);
userRouter.post('/purchase',purchaseCourse);
userRouter.post('/update-course-progess',updateUserCourseProgress)
userRouter.post('/get-course-progess',getUserCourseProgess)
userRouter.post('/add-rating',addUserRating)
export default userRouter;