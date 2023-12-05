import PropTypes from 'prop-types'
import { useLocation, useParams } from "react-router-dom"
import { useState, useEffect, useContext } from "react"
import WorkSpaceTab from "../WorkSpaceTab"
import { MdOutlineTimer, MdMemory } from "react-icons/md"
import { BsCheck2Circle } from "react-icons/bs"
import { IoIosCloseCircleOutline } from "react-icons/io"
import { IoBugOutline } from "react-icons/io5"
import SubmissionTable from './SubmissionTable/SubmissionTable'
import { apiProblemSubmissionItem, apiProblemSubmissionItems } from "../../../api"
import { TEXT_COLOR, COMPILE_LANGUAGE, STATUS } from "../../../constant"
import { formatTimestamp } from '../../../dateconfig'
import { getAuthToken } from "../../../utils"
import { AuthContext, CodeContext } from "../../../context"
import MDEditor from '@uiw/react-md-editor'
import Split from 'react-split'
import { useSetRecoilState } from "recoil"
import { authModalState } from "../../../atoms/authModalAtom"
import AlgorithmHeader from './SubmissionHeader/AlgorithmHeader'
import DatabaseHeader from './SubmissionHeader/DatabaseHeaderResult'

ProblemSubmission.propTypes = {
  problem: PropTypes.object.isRequired,
}


export default function ProblemSubmission({ problem }) {
  const { setCode } = useContext(CodeContext)
  const { isLogin, setUserProfile } = useContext(AuthContext)
  const setAuthModalState = useSetRecoilState(authModalState)
  const location = useLocation()
  const { problemId, submittedId } = useParams()
  
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [headerResult, setHeaderResult] = useState(null)


  const token = getAuthToken()
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }

  useEffect(() => {
    const fetchData = async() => {
      try {
        const { data } = await apiProblemSubmissionItems(problemId, config)
        // if (!submittedId) setHeaderResult(data.data[0])
        setResults(data.data)
      } catch(error) {
        console.error('Error fetching data', error)
      } finally {
        setLoading(false)
      }
    }
    if (isLogin) {
      fetchData()
    } else {
      setResults([])
      setUserProfile(null)
    } 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problemId, location.state, isLogin])

  useEffect(() => {
    const fetchData = async() => {
      try {
        if (!submittedId && results.length) {
          const { data } = await apiProblemSubmissionItem(problemId, results[0].id, config)
          return setHeaderResult(data.data)
        }
        if (submittedId) {
          const { data } = await apiProblemSubmissionItem(problemId, submittedId, config)
          setCode(data.data.code)
          return setHeaderResult(data.data)
        }
      } catch(error) {
        console.error('Error fetching header data', error)
      } 
    }
    if (location.state) return setHeaderResult(location.state.submissionResult)

    if (isLogin) {
      fetchData()
    } else {
      setHeaderResult(null)
      setUserProfile(null)
    } 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state, submittedId, results, isLogin])
  
	return (
    <div className='bg-dark-layer-1'>
      <WorkSpaceTab />
      <div className='flex flex-col px-0 py-4 h-[calc(100vh-94px)] '>
      { isLogin && (
         <Split className='h-[calc(100vh-94px)]' direction='vertical' sizes={[40, 60]} minSize={0}>
         <div className='px-5 w-full overflow-y-auto'>
         { !problem.database && headerResult && ( <AlgorithmHeader headerResult={ headerResult }/>)}
         { problem.database && headerResult && ( <DatabaseHeader headerResult={ headerResult }/>)}
       </div>
   
         
          
        {/* history table */}
        <div className='overflow-y-auto'>
          <table className=' table-fixed text-left text-gray-500 dark:text-gray-400 sm:w-7/12 w-full max-w-[1200px] mx-auto'>
            <thead className='text-sm text-gray-700 dark:text-gray-400 border-y border-gray-400'>
              <tr>
                <th scope='col' className='px-4 py-3 w-40 font-medium'>
                  Status
                </th>
                <th scope='col' className='px-5 py-3 w-28 font-medium'>
                  Language
                </th>
                <th scope='col' className='px-1 py-3 w-24 font-medium'>
                  Runtime
                </th>
                <th scope='col' className='px-1 py-3 w-24 font-medium'>
                  Memory
                </th>
              </tr>
            </thead>
            <SubmissionTable results={results}/>
          </table>
        </div>
        </Split>
      )}
      {!isLogin && (
        <div className="flex flex-col items-center justify-center h-full text-center text-dark-gray-8"> 
          <div> Join Pharm Code to Code!</div>
          <div className="text-sm mb-4"> View your Submission records here </div>
          <button className='bg-dark-fill-3 py-1 px-3 cursor-pointer rounded
            hover:text-white hover:bg-brand-orange hover:border-2 hover:border-brand-orange border-2 border-transparent
            transition duration-300 ease-in-out'
            onClick={() => setAuthModalState((prev) => ({ ...prev, isOpen: true, type: "login" }))}>Register or Sign In
          </button>
        </div>

      )}
     
      </div>
    </div>
	)
}