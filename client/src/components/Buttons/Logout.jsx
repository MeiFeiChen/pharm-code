import React from 'react'
import { FiLogOut } from "react-icons/fi"


export default function Logout() {

  const handleLogout = () => {
    
  }

  return (
		<button 
      className='
        bg-dark-fill-3 py-1.5 px-3 cursor-pointer 
        rounded text-brand-orange'
      onClick={handleLogout}
    >
			<FiLogOut />
		</button>
	);
}