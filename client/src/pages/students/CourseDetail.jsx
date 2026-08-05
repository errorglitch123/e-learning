import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/students/Loading'
import { assets } from '../../assets/assets';
import humanizeDuration from 'humanize-duration';
import Footer from '../../components/students/Footer';
import Youtube from 'react-youtube'
import axios from 'axios';
import { toast } from 'react-toastify';

const CourseDetail = () => {
  const { id } = useParams()
  const [courseData, setCourseData] = useState(null)
  const [openSection, setOpenSection] = useState({})
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false)
  const [playerData, setPlayerData] = useState(null)
  const { calculateRating, calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLecture, currency, backendUrl, userData, getToken } = useContext(AppContext)
  const fetchCourseData = async () => {
    try {
      const { data } = await axios.get(backendUrl + `/api/course/${id}`)
      if (data.success) {
        setCourseData(data.courseData)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  const toggleSection = (index) => {
    setOpenSection((prev) => (
      {
        ...prev,
        [index]: !prev[index],
      }
    ))
  }
  const enrolledCourse = async () => {
    try{
      if(!userData){
        return toast.warn('Please login to Enroll')
      }
      if(isAlreadyEnrolled){
        return toast.warn('You are already enrolled in this course')
      }
      const token = await getToken();
      const { data } = await axios.post(backendUrl + `/api/user/purchase`, {courseId: courseData._id}, { headers: { Authorization: `Bearer ${token}` } })
      if(data.success){
        const {session_url}=data;
        window.location.replace(session_url)
      }
    }
    catch(error){
      toast.error(error.message)
    }
  }
  useEffect(() => {
    fetchCourseData();
  }, [])
  useEffect(() => {
    if(userData && courseData){
      setIsAlreadyEnrolled(userData.enrolledCourses.includes(courseData._id));
    }
  }, [userData, courseData])

  return (
    courseData ? (
      <>
        <div className=" flex flex-row gap-10 relative items-start justify-between md:pt-20 pt-15 px-7 md:px-36 space-y-7 text-left " >
          <div className="absolute top-0 left-0 w-full h-[550px] z-10 bg-gradient-to-b from-cyan-100/70 to-white"
          ></div>
          {/* leftcolumn */}
          <div className='max-w-xl z-10 text-gray-500'>
            <h1 className='md:text-course-details-heading-large
        text-course-details-heading-small font-semibold text-gray-800  '>{courseData.courseTitle}</h1>
            <p className='pt-4 md:text-base text-sm'
              dangerouslySetInnerHTML={{ __html: courseData.courseDescription.slice(0, 200) }}></p>

            {/* course rating*/}
            <div className="flex items-center space-x-2 pt-3 pb-1 text-sm">
              <p>{calculateRating(courseData)}</p>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, index) => (
                  <img key={index} src={
                    index < Math.floor(calculateRating(courseData)) ? assets.star : assets.star_blank
                  } className="w-4 h-4" />
                ))}
              </div>
              <p className="text-sm text-gray-500">({courseData.courseRating.length})</p>
              <p>{courseData.enrolledStudents.length} {courseData.enrolledStudents.length > 1 ? 'Students' : 'Student'}</p>
            </div>
            <p className='text-sm'>Course by <span className='text-blue-600 underline'>{courseData.educator.name}</span></p>

            <div className='pt-8 text-gray-800'>
              <h2 className='text-xl font-semibold'>Course Structure</h2>
              <div className='pt-5'>
                {courseData.courseContent.map((chapter, index) => (
                  <div key={index} className='border border-gray-300 bg-white rounded mb-2' >
                    <div className='flex items-center justify-between px-4 py-3 cursor-pointer select-none'
                      onClick={() => toggleSection(index)}>
                      <div className='flex items-center gap-2'>
                        <img src={assets.down_arrow_icon} alt="arrow_icon"
                          className={`transform transition-transform ${openSection[index] ? 'rotate-180' : ''}`} />
                        <p className='font-medium md:text-base text-sm'>{chapter.chapterTitle}</p>
                      </div>
                      <p className='text-sm md:text-default'>{chapter.chapterContent.length} lecture - {calculateChapterTime(chapter)}</p>
                    </div>

                    <div className={`overflow-hidden transition-all duration-300 ${openSection[index] ? 'max-h-96' : 'max-h-0'}`}>
                      <ul className='list-disc md:pl-10 pl-4  pr-4 py-2 text-gray-600 border-t
                          border-gray-300'>
                        {chapter.chapterContent.map((lecture, i) => (
                          <li key={i} className='flex items-start gap-2 py-1'>
                            <img src={assets.play_icon} alt="play" className='w-4 h-4 mt-1' />
                            <div className='flex items-center justify-between w-full text-xs text-gray-800 md:text-default'>
                              <p>{lecture.lectureTitle}</p>
                              <div className='flex gap-2'>
                                {lecture.isPreviewFree &&
                                  <p className='text-blue-500 cursor-pointer'
                                    onClick={() =>
                                      setPlayerData({
                                        videoId: lecture.lectureUrl.includes("v=") ? lecture.lectureUrl.split("v=")[1].split("&")[0] : lecture.lectureUrl.split("/").pop().split('?')[0],
                                      })
                                    }
                                  >Preview</p>}
                                <p>{humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ["h", "m"] })}</p>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            <div className='py-20 text-sm md:text-def'>
              <h1 className='text-xl font-semibold text-gray-800'>Course Description</h1>
              <p className='pt-3 rich-text'
                dangerouslySetInnerHTML={{ __html: courseData.courseDescription }}></p>
            </div>
          </div>

          {/*right side start here-----*/}
          <div className='max-w-course-card  z-10 shadow-custom-card rounded-t 
          md:rounded-none overflow-hidden bg-white min-w-75 sm:min-w-105 '>
            {
              playerData ? <Youtube videoId={playerData.videoId} opts={{
                playerVars: { autoplay: 1 }
              }} iframeClassName='w-full aspect-video' />
                : <img src={courseData.courseThumbnail} alt="" />
            }

            <div className='p-5'>
              <div>
                <img src={assets.time_left_clock_icon} alt="clock"
                  className='w-3.5' />

                <p className='text-red-500'><span className='font-medium'>5 days</span> left at this price!</p>
              </div>
              <div className='flex gap-3 items-center pt-2'>
                <p className='text-gray-800 md:text-4xl text-2xl font-semibold'>{currency}{(courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2)}</p>
                <p className='md:text-lg text-gray-500 line-through '>{currency}{courseData.coursePrice}</p>
                <p className='md:text-lg text-gray-500'>{courseData.discount}% off</p>
              </div>
              <div className='flex items-center text-sm md:text-default gap-4 pt-2 md:pt-4 text-gray-500'>
                <div className='flex items-center gap-1'>
                  <img src={assets.star} alt="star" />
                  <p>{calculateRating(courseData)}</p>
                </div>

                <div className='h-4 w-px bg-gray-500/40'></div>
                <div className='flex items-center gap-1'>
                  <img src={assets.time_clock_icon} alt="time" />
                  <p>{calculateCourseDuration(courseData)}</p>
                </div>

                <div className='h-4 w-px bg-gray-500/40'></div>
                <div className='flex items-center gap-1'>
                  <img src={assets.lesson_icon} alt="time" />
                  <p>{calculateNoOfLecture(courseData)} Lecture</p>
                </div>
              </div>
              <button onClick={enrolledCourse}
                className='md:mt-6 mt-4 w-full py-3 rounded bg-blue-600 text-white font-medium'
              >{isAlreadyEnrolled ? 'Already Enrolled' : 'Enroll Now'}</button>
              <div className='p-6'>
                <p className='md:text-xl text-lg font-medium text-gray-800'>What's in the course?</p>
                <ul className='ml-4 pt-2 text-sm md:text-default list-disc text-gray-500 '>
                  <li>LifeTime access with free updates.</li>
                  <li>Step-by-Step, hands-on project guidance.</li>
                  <li>Downloadable resources and source code.</li>
                  <li>Quizzes to test your knowledge.</li>
                  <li>Certificate of Competition.</li>
                </ul>
              </div>

            </div>
          </div>
        </div>
        <Footer />
      </>
    ) : <Loading />
  )
}

export default CourseDetail