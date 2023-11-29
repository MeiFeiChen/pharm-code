import AuthModal from "../components/Modals/Auth/AuthModal"
import { useRecoilValue } from "recoil"
import { authModalState } from "../atoms/authModalAtom"



function Auth() {
  const authModal =  useRecoilValue(authModalState)
  return (
    <>
      { authModal.isOpen && <AuthModal />}
    </>
  )
}

export default Auth