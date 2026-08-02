import mongoose, { mongo } from "mongoose";
const purchaseSchema = new mongoose.Schema({
  courseId:{type:mongoose.Schema.Types.ObjectId,
    ref:'Courses',
    required:true
  },
  userId:{type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
  },
  amount:{type:Number,required:true},
  status:{type:String,enum:['pending','completed','failed'], default:'pending'}
},{timestamps:true})
export const Purchase = mongoose.model('Purchase',purchaseSchema)