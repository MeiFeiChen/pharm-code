import WorkSpaceTab from '../WorkSpaceTab'
import { Routes, Route } from 'react-router-dom'

import { useState, useEffect} from 'react'
import { apiPostItems } from '../../../api'
import { useParams } from "react-router-dom"
import DiscussionPosts from '../Discussion/DiscussionPosts'
import SinglePost from '../Discussion/SinglePost'

export default function ProblemDiscussion() {
  const { problemId, postId } = useParams()
  const [ posts, setPosts] = useState([])
  const [ post, setPost ] = useState(null)

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
  }, [])

  
  return (
    <div className='bg-dark-layer-1'>
      <WorkSpaceTab />
      <div className='px-0 py-4 h-[calc(100vh-94px)] overflow-y-auto'>
        <Routes>
          <Route path='' element={<DiscussionPosts posts={ posts }/>}/>
          <Route path=':postId' element={<SinglePost/>} />
        </Routes>
      </div>
    </div>
  )
}