import { createContext } from "react";
import { dummyCourses } from "../assets/assets";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import { useAuth, useUser } from '@clerk/clerk-react';
import axios from "axios";


export const AppContext = createContext();
export const AppProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const currency = import.meta.env.VITE_CURRENCY || '$';

  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userData, setUserData] = useState([]);

  const navigate = useNavigate();
  const { getToken } = useAuth()
  const { user } = useUser();

  const fetchAllCourses = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/courses/all')
      if (data.success) {
        setAllCourses(data.courses)
      }
      else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  };

  //fetch user Data
  const fetchUserData = async () => {
    if (user.publicMetadata.role === "educator") {
      setIsEducator(true)
    }
    try {
      const token = await getToken();
      const { data } = await axios.get(backendUrl + '/api/user/data', { headers: { Authorization: `Bearer ${token}` } })
      if (data.success) {
        setUserData(data.user)
      }
      else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const calculateRating = (course) => {
    if (course.courseRatings.length === 0) return 0;
    let totalRating = 0;
    course.courseRatings.forEach(rating => {
      totalRating += rating.rating;
    });
    return Math.floor(totalRating / course.courseRatings.length * 10) / 10;
  };


  // lecture duration
  const calculateChapterTime = (chapter) => {
    let time = 0;
    chapter.chapterContent.map((lecture) => time += lecture.lectureDuration)
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] })
  }


  //course Duation 
  const calculateCourseDuration = (course) => {
    let time = 0;

    course.courseContent.forEach((chapter) => {
      chapter.chapterContent.forEach((lecture) => {
        time += lecture.lectureDuration;
      });
    });

    return humanizeDuration(time * 60 * 1000, {
      units: ["h", "m"],
    });
  };
  //number of lecture in course
  const calculateNoOfLecture = (course) => {
    let totalLecture = 0;
    course.courseContent.forEach(chapter => {
      if (Array.isArray(chapter.chapterContent)) {
        totalLecture += chapter.chapterContent.length
      }
    });
    return totalLecture;
  }

  // enrolled courses
  const fetchUserEnrolledCourses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(backendUrl + '/api/user/enrolled-courses', { headers: { Authorization: `Bearer ${token}` } })
      if (data.success) {
        setEnrolledCourses(data.enrolledCourses.reverse())
      } else {
        toast.error(data.message)
      }
    }
    catch (error) {
      toast.error(error.message)
    }
  }


  useEffect(() => {
    fetchAllCourses();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchUserEnrolledCourses();
    }
  }, [user])
  const value = {
    currency,
    allCourses,
    navigate,
    calculateRating,
    isEducator,
    setIsEducator,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLecture,
    enrolledCourses,
    backendUrl,
    userData,
    setUserData,
    getToken,
    fetchAllCourses,
    fetchUserEnrolledCourses,
  };
  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
}; 