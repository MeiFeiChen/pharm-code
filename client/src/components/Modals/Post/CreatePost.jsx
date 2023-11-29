import { IoClose } from "react-icons/io5"
import { useSetRecoilState } from "recoil"
import { postModalState } from "../../../atoms/postModalAtom"
import { useContext, useEffect, useState } from "react"
import MDEditor from '@uiw/react-md-editor'
import { BsSend } from "react-icons/bs"
import { getAuthToken } from "../../../utils"
import { apiPostSend } from "../../../api"
import { useParams } from "react-router-dom"
import { PostContext } from "../../../context"
import { toast, Zoom } from "react-toastify"

function CreatePost() {
  const { setNewPostId } = useContext(PostContext)
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const { problemId } = useParams()
  const closeModal = useCloseModal()
  const setPostModal = useSetRecoilState(postModalState)

  const isButtonDisabled = !title.trim() || !content.trim()

  const handleSubmit = async(event) => {
    event.preventDefault()
    console.log(title, content)
    const requestBody = { problemId, title, content }
    const token = getAuthToken()
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    }
    try {
      const { data } = await apiPostSend(problemId, requestBody, config)
      console.log(data)
      setNewPostId(data.postId)
      toast.success('Successfully posted', {  
        autoClose: 1000, 
        theme: "dark",
        hideProgressBar: true,
        closeOnClick: true, 
        draggable: true,
        transition: Zoom
      })  
      setPostModal((prev) => ({ ...prev, isOpen: false }))
    } catch (error) {
      console.error(error)
      toast.error('failed to post', {  
        autoClose: 1000, 
        theme: "dark",
        hideProgressBar: true,
        closeOnClick: true, 
        draggable: true,
        transition: Zoom
      }) 
    }
  }


  return (
    <>
    {/* header */}
    
    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white ">
          Create a New Post
      </h3>
      <button
        type='button'
        className='bg-transparent  rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-700 hover:text-white text-white'
        onClick={closeModal}
      >
        <IoClose className="h-5 w-5"/>
      </button>
      
      
    </div>
    {/* body */}
    <form className="p-4 md:p-5">
      <div className="grid gap-4 mb-4 grid-cols-1">
        <div>
          <input 
            type="text" 
            name="name" 
            id="name" 
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
              focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-zinc-700 
              dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 
              dark:focus:border-primary-500 " 
            placeholder="Enter your title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required />
        </div>
        <div className="container w-full">
          <MDEditor
            value={content}
            onChange={setContent}
            highlightEnable={false}
            height={500}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <button
          className={`
          px-3 py-1.5 font-medium items-center 
          focus:outline-none inline-flex text-sm text-white rounded-lg
          ${isButtonDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-dark-green-s hover:bg-light-green-s'}
          `}
          onClick={handleSubmit}
          disabled={isButtonDisabled}
        >
          <div className=''>
            <BsSend className='fill-gray-6 mr-1 fill-dark-gray-6'/>
          </div>
          Send
      </button>
    </div>

    </form>
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

export default CreatePost