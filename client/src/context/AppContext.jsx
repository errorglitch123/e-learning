import {createContext} from "react";
import {dummyCourses} from "../assets/assets";
import {useState,useEffect} from "react";
import {useNavigate} from "react-router-dom";
import humanizeDuration from "humanize-duration";
import {useAuth,useUser} from '@clerk/clerk-react';


export const AppContext = createContext();
export const AppProvider = (props) => {
  const currency = import.meta.env.VITE_CURRENCY || '$';
  const [allCourses,setAllCourses] = useState([]);
  const [isEducator,setIsEducator] = useState(true);
  const [enrolledCourses,setEnrolledCourses] = useState([]);
  const navigate = useNavigate();
  const {getToken} = useAuth()
  const {user} = useUser();

  const fetchAllCourses = async () => {
      setAllCourses(dummyCourses);
  };
  const calculateRating = (course) => {
    if( course.courseRatings.length ===0) return 0;
    let totalRating = 0;
    course.courseRatings.forEach(rating => {
      totalRating += rating.rating;
    });
    return totalRating / course.courseRatings.length;
  };
  // lecture duration
  const calculateChapterTime = (chapter)=>{
    let time = 0;
    chapter.chapterContent.map((lecture)=> time+=lecture.lectureDuration)
    return humanizeDuration(time*60*1000,{units:["h","m"]})
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
  const calculateNoOfLecture = (course)=>{
    let totalLecture = 0;
    course.courseContent.forEach(chapter => {
      if(Array.isArray(chapter.chapterContent)){
        totalLecture+= chapter.chapterContent.length
      }
    });
    return totalLecture;
  }

  // enrolled courses
  const fetchUserEnrolledCourses = async ()=>{
    setEnrolledCourses(dummyCourses)
  }


useEffect(() => {
    fetchAllCourses();
    fetchUserEnrolledCourses();
  }, []);
  const logToken = async ()=>{
    console.log(await getToken());
  }
  useEffect(()=>{
    if(user){
      logToken();
    }
  },[user])
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
    setEnrolledCourses
  };
  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
}; 