import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/students/Home'
import CoursesList from './pages/students/CoursesList'
import CourseDetail from './pages/students/CourseDetail'
import MyEnrollment from './pages/students/MyEnrollment'
import Player from './pages/students/Player'
import Loading from './components/students/Loading'
import Educator from './pages/educator/Educator'
import Dashboard from './pages/educator/Dashboard'
import AddCourse from './pages/educator/AddCourse'
import MyCourse from './pages/educator/MyCourse'
import StudentEnrolled from './pages/educator/StudentEnrolled'
import Navbar from './components/students/Navbar'
import { useMatch } from 'react-router-dom'
import {ToastContainer, toast} from "react-toastify";

const App = () => {
  const isEducatorRoute = useMatch('/educator/*');
  return (
    <div className = "text-default min-h-screen bg-white">
    <ToastContainer/>
      {!isEducatorRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course-list" element={<CoursesList />} />
        <Route path="/course-list/:input" element={<CoursesList />} />
        <Route path="/course/:id" element={<CourseDetail />} />
        <Route path="/my-enrollment" element={<MyEnrollment />} />
        <Route path="/player/:courseId" element={<Player />} />
        <Route path="/loading/:path" element={<Loading />} />

        <Route path="/educator" element={<Educator />} >
          <Route index element={<Dashboard />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="my-course" element={<MyCourse />} />
          <Route path="student-enrolled" element={<StudentEnrolled />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App