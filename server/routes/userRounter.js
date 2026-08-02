import express from 'express'
import { getUserById, purchaseCourse, userEnrolledCourses } from '../controllers/userController';

const userRouter = express.Router();
userRouter.get('/data',getUserById);
userRouter.get('/enrolled-courses',userEnrolledCourses);
userRouter.post('/purchase',purchaseCourse);
export default userRouter;