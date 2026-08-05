import React, { useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { useContext } from 'react';
import { toast } from 'react-toastify';

const Loading = () => {
  const {path} = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { backendUrl, getToken, fetchUserEnrolledCourses } = useContext(AppContext);

  useEffect(() => {
    if(path){
      const verifyStripe = async () => {
        const sessionId = searchParams.get('session_id');
        if (sessionId) {
          try {
            const token = await getToken();
            await axios.post(`${backendUrl}/api/user/verify-stripe`, { sessionId }, { headers: { Authorization: `Bearer ${token}` }});
            // Update context state immediately after verifying
            await fetchUserEnrolledCourses();
          } catch (error) {
            console.error("Verification failed:", error);
          }
        }
      };

      verifyStripe();

      const timer = setTimeout(() => {
        navigate(`/${path}`);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [path]);

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='w-16 sm:w-20  aspect-square border-4 border-gray-300 
      border-t-4 border-t-blue-400 rounded-full animate-spin'></div>
    </div>
  )
}

export default Loading