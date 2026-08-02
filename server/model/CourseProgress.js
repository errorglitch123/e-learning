import mongoose, { mongo } from "mongoose";

const courseProgressSchema = new mongoose.Schema({
  userId:{type:String,requried:true},
  courseId:{type:String,requried:true},
  completed:{type:Boolean,requried:true},
  lectureCompleted:[]
},{minimize:false});
export const Courseprogess = mongoose.model('CourseProgess',courseProgressSchema);