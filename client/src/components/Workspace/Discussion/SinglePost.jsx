import { IoClose } from "react-icons/io5"
import { useNavigate, useParams } from "react-router-dom"
import { formatTimestamp } from "../../../dateconfig"
import { BiMessage } from "react-icons/bi"
import { useEffect, useState } from "react"
import { apiLeavePostMessage, apiPostItem, apiPostMessageItem } from "../../../api"
import MDEditor from '@uiw/react-md-editor'
import { AuthContext } from "../../../context"
import { useContext } from "react"
import { getAuthToken } from "../../../utils"
import { Zoom, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { socket } from "../../../socket"
import rehypeSanitize from "rehype-sanitize"


function SinglePost() {
  const { isLogin, setIsLogin, setUserProfile } = useContext(AuthContext)
  const { problemId, postId } = useParams()
  const [ content, setContent ] = useState('')
  const navigate = useNavigate()
  const [ post, setPost ] =  useState(null)
  const [ messages, setMessages ] = useState(null)

  const handleMessage = (newMessage) => {
    console.log('Received message:', newMessage)
    setMessages((prevMessages) => [newMessage, ...prevMessages])
  }
  const handleConnect = () => {
    console.log(`Connected to the socket as a consumer, ${postId}`)
      socket.emit('joinPost', postId)
  }

  useEffect(() => {
    socket.connect()
    socket.on('connect', handleConnect)
    socket.on('message', handleMessage)

    return () => {
      socket.off('connect', handleConnect)
      socket.off('message', handleMessage)
      socket.disconnect()
    }
  }, [postId])
  
  useEffect(() => {
    const fetchMessageData = async () => {
      try {
        const postData = await apiPostItem(problemId, postId)
        const messagesData = await apiPostMessageItem(problemId, postId)
        setPost(postData.data.data)
        setMessages(messagesData.data.data)
      } catch (error) {
        console.error('Error fetching message data:', error)
      }
    }
  
    fetchMessageData()
  }, [problemId, postId])


  const handleButtonClick = () => {
    navigate(`/problems/${problemId}/discussion`)
  }

  const handleSubmit = async() => {
    const requestBody = { content }
    const token = getAuthToken()
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    }
    try {
      await apiLeavePostMessage(problemId, postId, requestBody, config)
      toast.success('Leave a Comment Successfully', { 
        position: "top-center", 
        autoClose: 500, 
        theme: "dark",
        hideProgressBar: true,
        closeOnClick: true, 
        draggable: true,
        transition: Zoom
      })  
      setContent('') 
    } catch (error) {
      console.error(error)
      setIsLogin(false)
      setUserProfile(null)
    }
  }
  

  return (
    <div className='px-5 w-full'>
      <div className="flex border-b rounded-t dark:border-gray-600">
        <button
          type='button'
          className='bg-transparent rounded-lg text-sm p-1 hover:text-white text-gray-600'
          onClick={handleButtonClick}
        >
          <IoClose className="h-5 w-5"/>
        </button>
      </div>
      {/* 貼文的內容 */}
      <div className='py-5'>
        {/* 標題 大頭貼 時間 */}
        {post &&(
        <>
          <div  className='flex items-center pb-2'>
            <img className="w-6 h-6 rounded mr-2" src="/avatar.png" alt="Default avatar" />
            <div className='text-sm font-bold dark:text-white'>
              {post.name}
            </div>
            <div className='text-sm text-gray-400'>
            ．
            </div>
            <div className='text-sm text-gray-400'>
              {formatTimestamp(post.post_created_at)}
            </div>
          </div>
          {/* 標題 */}
          <div>
            <div className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">{post.title}</div>
          </div>
          {/* 內文 */}
          <div className="py-3 text-sm text-white">
          <MDEditor.Markdown 
                source={post.content}
                className="bg-transparent" />
          </div>
          <div className="flex items-center justify-end text-gray-400 text-sm ml-auto">
              <BiMessage className='mt-1'/>
              <div className='ml-1'>{messages.length}</div>
          </div>
        </>
        )}
      </div>
      {/* 貼文的留言區 */}
      <div className="container w-full">
        <div className="flex flex-col">
          <MDEditor
            value={content}
            onChange={setContent}
            highlightEnable={false}
            preview="edit"
            height={150}
            visibleDragbar={false}
            previewOptions={{
              rehypePlugins: [[rehypeSanitize]],
            }}
          />
        </div>

        <div className="flex justify-end mt-3">
          <button
            className={`
              px-3 py-1.5 font-medium transition-all 
              focus:outline-none inline-flex text-sm text-white rounded-lg
              ${(!isLogin || !content.trim()) ? 'bg-dark-gray-6 cursor-not-allowed' : 'bg-dark-green-s hover:bg-light-green-s'}
            `}
            onClick={ handleSubmit }
            disabled={(!isLogin || !content.trim())}
          >
            Comment
          </button>
       
        </div>
     </div>

      <div>
        {messages?.map((message, index) => (
          <div 
            key={message.id} 
            className={`rounded-lg p-3 ${index % 2 === 1 ? 'bg-dark-fill-3' : ''}`}
          >
            <div  className='flex items-center pb-2'>
              <img className="w-6 h-6 rounded mr-2" src="/avatar.png" alt="Default avatar" />
              <div className='text-sm font-bold dark:text-white'>
                {message.name}
              </div>
              <div className='text-sm text-gray-400'>
              ．
              </div>
              <div className='text-sm text-gray-400'>
                {formatTimestamp(message.created_at)}
              </div>
            </div>

            <div className="text-sm text-white">
              <MDEditor.Markdown 
                source={message.content} 
                className="bg-transparent" />
            </div>
          </div>

        ))}

      </div>


    </div>
  )
}

export default SinglePost