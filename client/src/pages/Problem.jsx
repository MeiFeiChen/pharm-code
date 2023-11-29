import { useParams} from 'react-router-dom'
import { useState } from 'react'
import TopBar from '../components/TopBar'
import WorkSpace from '../components/Workspace/WorkSpace'
import Post from './Post'
import { PostContext } from '../context'


export default function Problem() {
  const { problemId } = useParams()
  const [ newPostId, setNewPostId ] = useState(0)

  return (
    <div className='overflow-hidden'>
    <PostContext.Provider value={{ newPostId, setNewPostId }}>
      <TopBar problemPage/>
      <WorkSpace problemId={problemId}/>
      <Post />
    </PostContext.Provider>
    </div>
  )
}