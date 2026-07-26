import React from 'react'
import {AppContext} from "../../context/AppContext";
import {useContext} from "react";
import CourseCard from "./CourseCard";
const CourseSection = () => {
  const  {allCourses} = useContext(AppContext);
  return (
    <div className="py-16 md:px-8">
      <h2 className="text-3xl font-medium text-gray-800">Learn from the best</h2>
      <p className="text-sm md:text-base text-gray-500 mt-3 mb-3">
        Discover our top-rated courses across various subjects and skill levels.From coding 
        and design to business and personal development, our courses are designed to help you achieve your goals and advance your career.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {allCourses .slice(0,4).map((course,index) => (
          <CourseCard key={index} course={course} />
        ))}
      </div>
      <a href={'/course-list'} onClick ={()=>scrollTo(0,0)}
       className = 'text-gray-500 border border-gray-500/30 px-10 py-3 rounded mt-3'
      >Show all courses</a>
    </div>
  )
}

export default CourseSection