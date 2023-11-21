import { Link } from "react-router-dom"
import { useParams, useLocation } from 'react-router-dom'


export default function WorkSpaceTab() {
  const { problemId } = useParams()
  const location = useLocation()
 
  const isDescriptionTabActive = location.pathname === `/problems/${problemId}`
  const isSubmissionTabActive = location.pathname.startsWith(`/problems/${problemId}/submission`)
  const isDiscussionTabActive = location.pathname.startsWith(`/problems/${problemId}/discussion`)

  return (
    <div className='flex h-11 w-full pt-2 bg-dark-layer-2 text-white justify-around overflow-x-hidden  overflow-y-hidden'>
      <Link to={`/problems/${problemId}`} className="flex-1">
        <div className={`
          ${
            isDescriptionTabActive ? 'bg-dark-layer-1' : 'bg-dark-layer-2'
          }
          bg-dark-layer-1  rounded-t-[5px] px-5 py-[10px] text-sm cursor-pointer`}>
          Description
        </div>
      </Link>
      <Link to={`/problems/${problemId}/submission`} className="flex-1">
        <div className={`
          ${
            isSubmissionTabActive ? 'bg-dark-layer-1' : 'bg-dark-layer-2'
          }
          bg-dark-layer-1  rounded-t-[5px] px-5 py-[10px] text-sm cursor-pointer`}>
            Submission
        </div>
      </Link>
      <Link to={`/problems/${problemId}/discussion`} className="flex-1">
      <div className={`
          ${
            isDiscussionTabActive ? 'bg-dark-layer-1' : 'bg-dark-layer-2'
          }
          bg-dark-layer-1  rounded-t-[5px] px-5 py-[10px] text-sm cursor-pointer`}>
          Discussion   
      </div>
      </Link>
    </div>
  )
}
