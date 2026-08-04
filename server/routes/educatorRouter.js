import express from 'express'
import { addNewCourse, educatorDashboardData, getEducatorCourses, getEnrolledStudentData, updateRoleToEducator } from '../controllers/educatorController.js'
import upload from '../configs/multer.js';
import { protectEducator } from '../middlewares/authMiddleware.js';
import { requireAuth } from '@clerk/express';

const educatorRouter = express.Router()
// add educator
educatorRouter.get('/update-role', requireAuth(), updateRoleToEducator);
educatorRouter.post('/add-course', upload.single('image'), requireAuth(), protectEducator, addNewCourse)
educatorRouter.get('/courses', requireAuth(), protectEducator, getEducatorCourses)
educatorRouter.get('/dashboard', requireAuth(), protectEducator, educatorDashboardData)
educatorRouter.get('/enrolled-students', requireAuth(), protectEducator, getEnrolledStudentData)


export default educatorRouter;