import express from "express";
import {allCourses, getCourseId} from "../controllers/courseController.js";

const courseRouter = express.Router();
courseRouter.get('/all',allCourses);
courseRouter.get('/:id',getCourseId);
export default courseRouter;