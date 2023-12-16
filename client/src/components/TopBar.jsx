import { Link, useNavigate } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import Logout from "./Buttons/Logout"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import { BsList } from "react-icons/bs"
import { AuthContext } from "../context"
import PropTypes from 'prop-types'
import { useSetRecoilState } from "recoil"
import { authModalState } from "../atoms/authModalAtom"
import { S3_DOMAIN } from "../constant"

TopBar.propTypes = {
  problemPage: PropTypes.bool,
}

export default function TopBar({ problemPage, lastProblemId, nextProblemId }) {
  const setAuthModalState = useSetRecoilState(authModalState)
  const { isLogin, userProfile } = useContext(AuthContext)
  const [ windowWidth, setWindowWidth ] = useState(window.innerWidth)
  const [ isToggleOpen, setIsToggleOpen ] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    }
  }, [])

  const showAvatarAndSignIn = windowWidth >= 640
  


  return (
    <nav className={`
      relative flex h-[50px] w-full shrink-0 items-center 
      pl-10 pr-20 bg-dark-layer-1 text-dark-gray-7
      `}>
      <div className='flex w-full items-center'>
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={`${S3_DOMAIN}/logo-circle.png`} alt="Logo" className="h-[36px] opacity-80 hover:opacity-100 transition-opacity"/>
        </Link>
        
        <Link to="/problems" className="px-2 py-1 ml-3 flex items-center hover:bg-dark-fill-2 rounded-lg">
          <div className="text-xl text-dark-gray-6  hover:text-white ">
            Problems
          </div>
        </Link>
        
   
        {/* problem Page */}
        {problemPage && (
					<div className='flex items-center gap-4 flex-1 ml-4'>
					{lastProblemId ? (
              <div
                className='flex items-center justify-center rounded bg-dark-fill-3 hover:bg-dark-fill-2 h-7 w-8 cursor-pointer'
                onClick={() => navigate(`/problems/${lastProblemId}`)}
              >
                <FaChevronLeft />
              </div>
            ) : (
              <div className='flex items-center justify-center rounded bg-dark-layer-1 h-7 w-8' />
          )}
					{nextProblemId ? (
              <div
                className='flex items-center justify-center rounded bg-dark-fill-3 hover:bg-dark-fill-2 h-7 w-8 cursor-pointer'
                onClick={() => navigate(`/problems/${nextProblemId}`)}
              >
                <FaChevronRight />
              </div>
            ) : (
              <div className='flex items-center justify-center rounded bg-dark-layer-1 h-7 w-8' />
          )}
					</div>
				)}

      
      {showAvatarAndSignIn && (
        <div className='flex items-center space-x-4 flex-1 justify-end'>
        {/* Sign in */}
        {!isLogin && (

          <button className='bg-dark-fill-3 py-1 px-3 cursor-pointer rounded w-[80px]
          hover:text-white hover:bg-brand-orange hover:border-2 hover:border-brand-orange border-2 border-transparent
          transition duration-300 ease-in-out'
          onClick={() => setAuthModalState((prev) => ({ ...prev, isOpen: true, type: "login" }))}>Sign In</button>
        )}
        
  
        {/* Avatar && Sign out*/}
        {isLogin && (
          <>
            <div className='cursor-pointer group relative ml-3 flex-shrink-0'>
              <Link to='/profile'>
              <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${userProfile?.name}&backgroundColor=546e7a`} alt='Avatar' width={30} height={30} className='rounded-full' />
              
              <div
                className='
                absolute top-10 left-2/4 -translate-x-2/4  
                mx-auto bg-dark-layer-3 text-brand-orange p-2 rounded shadow-lg
                z-40 group-hover:scale-100 scale-0 
                transition-all duration-300 ease-in-out'
              >
                <p className="text-sm">{userProfile?.email}</p>
              </div>
              </Link>
            </div>
            <Logout />
          </>
        )}

        </div>
      )}
       {!showAvatarAndSignIn && (
          <button
            className="text-white focus:outline-none ml-auto"
            onClick={() => setIsToggleOpen((prev) => !prev)}
          >
            ☰
          </button>
        )}
      </div>


    </nav>
  )

}