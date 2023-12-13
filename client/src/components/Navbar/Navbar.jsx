import { Link } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'
import { authModalState } from '../../atoms/authModalAtom'
import { S3_DOMAIN } from '../../constant'
import { AuthContext } from '../../context'
import { useContext } from 'react'
import Logout from '../Buttons/Logout'



function Navbar() {
  const setAuthModalState = useSetRecoilState(authModalState)
  const { isLogin, userProfile } = useContext(AuthContext)
  console.log(isLogin)

  const handleClick = () => {
    setAuthModalState((prev) =>( {...prev, isOpen: true }))
  }
  return (
    <div className='flex items-center justify-between sm:px-12 px-2 md:px-10'>
      <Link to='/problems' className='flex items-center justify-center h-20'>
        <img src={`${S3_DOMAIN}/logo-new.png`} alt='PharmCode' className='max-h-16' />
      </Link>
      <div className='flex items-center'>
      {!isLogin && (
        <button className='bg-brand-orange text-white px-2 py-1 sm:px-4 rounded-md text-sm font-medium
        hover:text-brand-orange hover:bg-white hover:border-2 hover:border-brand-orange border-2 border-transparent
        transition duration-300 ease-in-out'
        onClick={() => setAuthModalState((prev) => ({ ...prev, isOpen: true, type: "login" }))}>Sign In</button>
      )}

      {isLogin && (
        <>
        <div className='cursor-pointer group relative m-3 flex-shrink-0'>
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

    </div>
  )
}

export default Navbar