import { useSetRecoilState } from "recoil"
import { postModalState } from "../../../atoms/postModalAtom"
import { useEffect } from "react"
import CreatePost from "./CreatePost"

function PostModal() {
  const closeModal = useCloseModal()
  return (
    <>
    <div 
      className='absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-60' 
      onClick={closeModal}
    >
    </div>
    <div className='w-full sm:w-[80%]  absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]  flex justify-center items-center'>
      <div className='relative w-full h-full mx-auto flex items-center justify-center'>
        {/* Modal content */}
        <div className='bg-white rounded-lg shadow relative w-full dark:bg-zinc-800'>
          <CreatePost />
        </div>
      </div>
    </div>
	</>
  )
}

function useCloseModal() {
  const setPostModal = useSetRecoilState(postModalState)
  const closeModal = () => {
    setPostModal((prev) => ({ ...prev, isOpen: false }))
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

export default PostModal