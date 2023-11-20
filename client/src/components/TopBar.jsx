import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import Logout from "./Buttons/Logout"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import { BsList } from "react-icons/bs"


import React from 'react'



export default function TopBar({ problemPage }) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [isToggleOpen, setIsToggleOpen] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const showAvatarAndSignIn = windowWidth >= 640
  


  return (
    <nav className={`
      relative flex h-[50px] w-full shrink-0 items-center 
      px-20 bg-dark-layer-1 text-dark-gray-7
      ${showAvatarAndSignIn ? "px-20" : "px-10"}
      `}>
      <div className={`
        flex w-full items-center 
        ${showAvatarAndSignIn ? "justify-between" : "justify-center"} `}>
        {/* Logo */}
        <Link to="/problems">
          <img src="/logo-full.png" alt="Logo" className="h-full" />
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
        {/* 要再加user 狀態上去在 {(之間 {!user $$( .... */}
        {/* setAuthModal/}
  
        {/* Sign in */}
        {(
              <Link
                href='/auth'
                onClick={() => setAuthModalState((prev) => ({ ...prev, isOpen: true, type: "login" }))}
              >
                <button className='bg-dark-fill-3 py-1 px-3 cursor-pointer rounded w-[80px]'>Sign In</button>
              </Link>
        )}
        {/* Sign out */}
  
        {/* Avatar */}
        {(
              <div className='cursor-pointer group relative ml-3 flex-shrink-0'>
                <img src='/avatar.png' alt='Avatar' width={30} height={30} className='rounded-full' />
                <div
                  className='
                  absolute top-10 left-2/4 -translate-x-2/4  
                  mx-auto bg-dark-layer-1 text-brand-orange p-2 rounded shadow-lg
                  z-40 group-hover:scale-100 scale-0 
                  transition-all duration-300 ease-in-out'
                >
                  <p className="text-sm">{'admin@gmail.com'}</p>
                </div>
              </div>
        )}
        <Logout />
        
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