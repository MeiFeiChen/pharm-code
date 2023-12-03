import { Link } from "react-router-dom"
import { useParams, useLocation } from 'react-router-dom'


export default function WorkSpaceTab() {
  const { problemId } = useParams()
  const location = useLocation()
 
  const isDescriptionTabActive = location.pathname === `/problems/${problemId}`
  const isSubmissionTabActive = location.pathname.startsWith(`/problems/${problemId}/submission`)
  const isDiscussionTabActive = location.pathname.startsWith(`/problems/${problemId}/discussion`)

  return (
    <div className='w-full bg-dark-layer-2'>
      <div className="flex h-[35px] w-full bg-[#373637] text-dark-gray-6 overflow-x-hidden  mt-2 overflow-y-hidden rounded-t-lg border-b border-b-dark-fill-3 font-medium">
      <Link to={`/problems/${problemId}`} className="">
        <div className={`
          ${
            isDescriptionTabActive ? 'text-white border-b-[2px]' : ''
          }
          bg-[#373637] px-5 py-[6px] text-sm text-dark-gray-6 `}>
          Description
        </div>
      </Link>
     
      <Link to={`/problems/${problemId}/discussion`} className="">
      <div className={`
          ${
            isDiscussionTabActive ? 'text-white border-b-[2px]' : ''
          }
          bg-[#373637] px-5 py-[6px] text-sm text-dark-gray-6 `}>
          Discussion   
      </div>
      </Link>
      <Link to={`/problems/${problemId}/submission`} className=''>
        <div className={`
          ${ isSubmissionTabActive ? 'text-white border-b-[2px]' : ''}
          bg-[#373637]  px-5 py-[6px] text-sm text-dark-gray-6 `}>
          Submission
        </div>
      </Link>
      </div>
    </div>
  )
}
