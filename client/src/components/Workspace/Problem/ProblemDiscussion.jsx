import WorkSpaceTab from '../WorkSpaceTab'
import { Routes, Route } from 'react-router-dom'
import DiscussionPosts from '../Discussion/DiscussionPosts'
import SinglePost from '../Discussion/SinglePost'


export default function ProblemDiscussion() {  
  return (
    <div className='bg-dark-layer-1'>
      <WorkSpaceTab />
      <div className='px-0 py-4 h-[calc(100vh-94px)] overflow-y-auto bg-dark-layer-1'>
        <Routes>
          <Route path='' element={<DiscussionPosts />}/>
          <Route path=':postId' element={<SinglePost/>} />
        </Routes>
      </div>
    </div>
  )
}