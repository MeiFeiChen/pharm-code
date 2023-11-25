import AuthModal from "../components/Modals/AuthModal"
import Navbar from "../components/Navbar/Navbar"
import { useRecoilValue } from "recoil"
import { authModalState } from "../atoms/authModalAtom"



function Auth() {
  const authModal =  useRecoilValue(authModalState)
  return (
    <>
    {/* <div className="bg-gradient-to-b from-gray-600 to-black h-screen relative'"> */}
      {/* <div className="max-w-7xl mx-auto">
        <Navbar />
      </div> */}
      { authModal.isOpen && <AuthModal />}

    {/* </div> */}
    </>
  )
}

export default Auth