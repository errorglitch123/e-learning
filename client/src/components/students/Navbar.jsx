import React from 'react'
import { assets } from "../../assets/assets"
import { Link, useLocation } from 'react-router-dom'
import { useClerk, useUser, UserButton } from "@clerk/clerk-react";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

const Navbar = () => {
  const location = useLocation();
  const { navigate, isEducator, backendUrl, gettoken } = useContext(AppContext);
  const isConstListPage = location.pathname === "/const-list";
  const { openSignIn, openSignUp } = useClerk();
  const { isSignedIn, user } = useUser();

  const becomeEducator = async () => {
    try {
      if (isEducator) {
        navigate("/educator");
        return;
      }
      const token = await gettoken();
      const { data } = await axios.post(backendUrl + '/api/educator/update-role', { headers: { Authorization: `Bearer ${token}` } })
      if (data.success) {
        setIsEducator(true);
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(data.message);
    }
  };

  return (
    <div className={`flex justify-between items-center px-4 sm:px-10 md:px-14 lg:px-36 border-b
     border-gray-500 py-4 ${isConstListPage ? 'bg-white' : 'bg-cyan-100/70'}`}  >
      <img src={assets.logo} alt="Logo" className="w-28 lg:w-32 cursor-pointer"
        onClick={() => navigate("/")}
      />
      <div className="hidden md:flex items-center gap-5 text-gray-500 font-semibold">
        <div className="flex items-center gap-5">
          {user &&
            <>
              <button onClick={becomeEducator}>
                {isEducator ? "Educator Dashboard" : "Be Educator"}
              </button>
              | <Link to="/my-enrollment">
                My Enrollment
              </Link>
            </>
          }
        </div>
        {user ? <UserButton afterSignOutUrl={"/"} /> :
          <button onClick={openSignIn} className="bg-blue-600 text-white 
          px-4 py-2 rounded-full cursor-pointer">Sign In</button>}
      </div>

      <div className="md:hidden flex items-center gap-2 sm:gap-5  text-gray-500 font-semibold">
        <div className="flex items-center gap-1 sm:gap-2 max-sm:text-xs">
          {user &&
            <>
              <button onClick={becomeEducator}>
                {isEducator ? "Educator Dashboard" : "Be Educator"}
              </button>
              | <Link to="/my-enrollment">
                My Enrollment
              </Link>
            </>
          }
        </div>
        {user ? <UserButton afterSignOutUrl={"/"} /> :
          <button onClick={openSignIn} className="bg-blue-600 text-white 
          px-4 py-2 rounded-full cursor-pointer">Sign In</button>}
      </div>
    </div>
  )
}

export default Navbar