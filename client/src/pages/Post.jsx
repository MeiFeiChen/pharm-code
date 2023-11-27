import PostModal from "../components/Modals/Post/PostModal"
import { useRecoilValue } from "recoil"
import { postModalState } from "../atoms/postModalAtom"

function Post() {
  const postModal =  useRecoilValue(postModalState)
  return (
    <>
      { postModal.isOpen && <PostModal />}
    </>
  )
}

export default Post