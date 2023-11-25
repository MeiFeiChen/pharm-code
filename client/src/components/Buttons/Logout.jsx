import { FiLogOut } from "react-icons/fi"
import { setAuthToken } from "../../utils"
import { AuthContext } from "../../context"
import { useContext } from "react"


export default function Logout() {
  const { setIsLogin, setUserProfile } = useContext(AuthContext)

  const handleLogout = () => {
    setAuthToken(null)
    setIsLogin(false)
    setUserProfile({})
  }

  return (
		<button 
      className='
        bg-dark-fill-3 py-1.5 px-3 cursor-pointer 
        rounded text-brand-orange
        hover:text-white hover:bg-brand-orange hover:border-2 hover:border-brand-orange border-2 border-transparent
        transition duration-300 ease-in-out'
      onClick={handleLogout}
    >
			<FiLogOut />
		</button>
	);
}