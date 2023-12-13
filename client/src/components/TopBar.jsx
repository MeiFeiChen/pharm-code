import { Link } from "react-router-dom"
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

export default function TopBar({ problemPage }) {
  const setAuthModalState = useSetRecoilState(authModalState)
  const { isLogin, userProfile } = useContext(AuthContext)
  const [ windowWidth, setWindowWidth ] = useState(window.innerWidth)
  const [ isToggleOpen, setIsToggleOpen ] = useState(false)

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
        <Link to="/problems" className="flex items-center">
          <img src={`${S3_DOMAIN}/logo-new.png`} alt="Logo" className="h-[40px]"/>
        </Link>
        {/* problem Page */}
        {problemPage && (
					<div className='flex items-center gap-4 flex-1 justify-center'>
						<div
							className='flex items-center justify-center rounded bg-dark-fill-3 hover:bg-dark-fill-2 h-8 w-8 cursor-pointer'
							onClick={() => handleProblemChange(false)}
						>
							<FaChevronLeft />
						</div>
						<Link
							to='/problems'
							className='flex items-center gap-2 font-medium max-w-[170px] text-dark-gray-8 cursor-pointer w-[100px]'
						>
							<p>Problem List</p>
						</Link>
						<div
							className='flex items-center justify-center rounded bg-dark-fill-3 hover:bg-dark-fill-2 h-8 w-8 cursor-pointer'
							onClick={() => handleProblemChange(true)}
						>
							<FaChevronRight />
						</div>
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
        // </Link>
        )}
        
  
        {/* Avatar && Sign out*/}
        {isLogin && (
          <>
          <div className='cursor-pointer group relative ml-3 flex-shrink-0'>
            <Link to='/profile'>
            <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${userProfile.name}`} alt='Avatar' width={30} height={30} className='rounded-full' />
            </Link>
            <div
              className='
              absolute top-10 left-2/4 -translate-x-2/4  
              mx-auto bg-dark-layer-1 text-brand-orange p-2 rounded shadow-lg
              z-40 group-hover:scale-100 scale-0 
              transition-all duration-300 ease-in-out'
            >
              <p className="text-sm">{userProfile?.email}</p>
            </div>
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