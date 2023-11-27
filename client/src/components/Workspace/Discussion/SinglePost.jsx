import { IoClose } from "react-icons/io5"
import { useNavigate, useParams } from "react-router-dom"
import { formatTimestamp } from "../../../dateconfig"
import { BiMessage } from "react-icons/bi"
import { useEffect, useState } from "react"
import { apiPostItem, apiPostMessageItem } from "../../../api"
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import MDEditor from '@uiw/react-md-editor'
import { AuthContext } from "../../../context"
import { useContext } from "react"


function SinglePost() {
  const { isLogin } = useContext(AuthContext)
  const { problemId, postId } = useParams()
  console.log(problemId, postId)
  const navigate = useNavigate()
  const [ post, setPost ] =  useState(null)
  const [ messages, setMessages ] = useState([])

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const { data } = await apiPostItem(problemId, postId);
        setPost(data.data);
      } catch (error) {
        console.error('Error fetching post data:', error);
      }
    };
  
    fetchPostData();
  }, [problemId, postId]);
  
  useEffect(() => {
    const fetchMessageData = async () => {
      try {
        const { data } = await apiPostMessageItem(problemId, postId);
        setMessages(data.data);
      } catch (error) {
        console.error('Error fetching message data:', error);
      }
    };
  
    fetchMessageData();
  }, [problemId, postId]);

  console.log(post, setMessages)
  
  


  const handleButtonClick = () => {
    navigate(`/problems/${problemId}/discussion`);
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
          <div className="py-5 text-sm text-white"  style={{ whiteSpace: 'pre-line' }}>
          <Markdown
            remarkPlugins={[remarkGfm]}
          >
            {post.content}
          </Markdown>
          </div>
        </>
        )}
      </div>
      {/* 貼文的留言區 */}
      <div className="container w-full">
        <div className="flex flex-col">
          <MDEditor
            value={'j'}
            // onChange={}
            highlightEnable={false}
            height={200}
          />
        </div>

        <div className="flex justify-end mt-3">
          <button
            className={`
              px-3 py-1.5 font-medium transition-all 
              focus:outline-none inline-flex text-sm text-white rounded-lg
              ${!isLogin ? 'bg-dark-gray-6 cursor-not-allowed' : 'bg-dark-green-s hover:bg-light-green-s'}
            `}
            // onClick={handleSubmit}
            disabled={!isLogin}
          >
            Comment
          </button>
        </div>
     </div>

      <div>
        {messages?.map((message) => (
          <div key={message.id}>
          </div>
        ))}

      </div>


    </div>
  )
}

export default SinglePost