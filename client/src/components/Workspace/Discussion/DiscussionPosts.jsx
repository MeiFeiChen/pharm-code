
import { GoPlus } from "react-icons/go"
import { BiMessage } from "react-icons/bi"
import { Link, useParams } from "react-router-dom"
import { useSetRecoilState } from "recoil"
import { formatTimestamp } from "../../../dateconfig"
import { AuthContext } from "../../../context"
import { useContext, useState, useEffect } from 'react'
import { postModalState } from "../../../atoms/postModalAtom"
import { apiPostItems } from "../../../api"
import { PostContext } from "../../../context"
import { Divider } from 'antd';

function DiscussionPosts() {
  const { newPostId } = useContext(PostContext)
  const setPostModalState = useSetRecoilState(postModalState)
  const { isLogin } = useContext(AuthContext)
  const { problemId } = useParams()
  const [ posts, setPosts] = useState(null)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await apiPostItems(problemId)
        setPosts(data.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchData()
  }, [problemId, newPostId])

  return (
    <div className='w-full'>
    <div className='px-5 pb-5'>
      <button
          className={`
          px-3 py-1.5 font-medium items-center 
          focus:outline-none inline-flex text-sm rounded-lg
          ${!isLogin ? 'bg-dark-gray-6 cursor-not-allowed text-dark-label-2' :'bg-dark-fill-3  hover:bg-dark-fill-2 text-dark-green-s'}
          `}
          onClick={() => setPostModalState((prev) => ({ ...prev, isOpen: true }))}
          disabled= { !isLogin }
      >
        <div className=''>
          <GoPlus className='mr-1 fill-dark-gray-8'/>
        </div>
        Posts
      </button>
    </div>

    <div >
      {/* Posts */}
      {posts?.map((post, index) => (
        <div key={post.post_id} className="flex flex-col items-center">
        <Link
          to={`${post.post_id}`}
          className="w-full block p-5  border border-transparent rounded-lg shadow hover:bg-gray-100  dark:hover:bg-gray-700"
          key={post.post_id}
        >

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
            <div className="flex items-center justify-end text-gray-400 ml-auto">
              <BiMessage className='mt-1'/>
              <div className='ml-1'>{post.message_count}</div>
            </div>
          </div>
        <div className="text-base font-bold tracking-tight text-gray-900 dark:text-white">{post.title}</div>
      </Link>
      {/* Divider */}
      {index !== posts.length - 1 && <hr className="w-[90%] h-px border-0 dark:bg-dark-fill-3" /> }
      </div>
      )
        

      )}
      

    </div>
  </div>
  )
}

export default DiscussionPosts