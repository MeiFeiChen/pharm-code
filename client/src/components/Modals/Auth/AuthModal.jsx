import { IoClose } from "react-icons/io5"
import Login from "./Login"
import Signup from "./Signup"
import ResetPassword from "./ResetPassword"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { authModalState } from "../../../atoms/authModalAtom"
import { useEffect } from "react"


function AuthModal() {
  const authModal = useRecoilValue(authModalState)
  const closeModal = useCloseModal()
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div 
      className='absolute inset-0 top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm' 
      onClick={closeModal}>
    </div>
    <div className='w-full sm:w-[450px]  absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]  flex justify-center items-center'>
      <div className='relative w-full h-full mx-auto flex items-center justify-center'>
        <div className='bg-opacity-50 rounded-lg shadow-[10px_10px_40px_-5px_rgba(255,255,255,0.3)] relative w-full bg-gradient-to-br bg-gray-600 mx-6 border border-gray-700'>
          <div className='flex justify-end p-2'>  
            <button
              type='button'
              className='text-white p-2 rounded-lg hover:bg-opacity-70'
              onClick={closeModal}
            >
              <IoClose className="h-5 w-5"/>
            </button>
          </div>
          {authModal.type === 'login' ? <Login/>: authModal.type === 'register' ? <Signup/> : <ResetPassword/>}
        </div>
      </div>
    </div>
	</div>
  )
}

function useCloseModal() {
  const setAuthModal = useSetRecoilState(authModalState)
  const closeModal = () => {
    setAuthModal((prev) => ({...prev, isOpen: false, type: 'login'}))
  }

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }
  , [])
  return closeModal
}


export default AuthModal