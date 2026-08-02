import express from 'express'
import { addNewCourse, educatorDashboardData, getEducatorCourses, getEnrolledStudentData, updateRoleToEducator } from '../controllers/educatorController.js'
import upload from '../configs/multer.js';
import { protectEducator } from '../middlewares/authMiddleware.js';

const educatorRouter = express.Router()
// add educator
educatorRouter.get('/update-role',updateRoleToEducator);
educatorRouter.post('/add-course',upload.single('image'),protectEducator,addNewCourse)
educatorRouter.get('/courses',protectEducator,getEducatorCourses)
educatorRouter.get('/dashboard',protectEducator,educatorDashboardData)
educatorRouter.get('/enrolled-students',protectEducator,getEnrolledStudentData)


export default educatorRouter;