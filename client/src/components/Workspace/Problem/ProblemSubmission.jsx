import { useLocation, useParams } from "react-router-dom"
import { useState, useEffect, useContext } from "react"
import WorkSpaceTab from "../WorkSpaceTab"
import { MdOutlineTimer, MdMemory } from "react-icons/md"
import { BsCheck2Circle } from "react-icons/bs"
import { IoIosCloseCircleOutline } from "react-icons/io"
import { IoBugOutline } from "react-icons/io5";
import SubmissionTable from "../SubmissionTable/SubmissionTable"
import { apiProblemSubmissionItem, apiProblemSubmissionItems } from "../../../api"
import { TEXT_COLOR, COMPILE_LANGUAGE, STATUS } from "../../../constant"
import { formatTimestamp } from '../../../dateconfig';
import { getAuthToken } from "../../../utils"
import { AuthContext, CodeContext } from "../../../context"
import MDEditor from '@uiw/react-md-editor'
import Split from 'react-split'
import { useSetRecoilState } from "recoil"
import { authModalState } from "../../../atoms/authModalAtom"


export default function ProblemSubmission() {
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
         { headerResult && (
           <>
             {/* The newest submission result */}
             <div className='flex items-center mt-3'>
               <div className={`rounded p-[3px] text-lg mr-1 ${TEXT_COLOR[headerResult.status]}`}>
                 {headerResult.status === 'AC' ? <BsCheck2Circle /> : <IoIosCloseCircleOutline />}
               </div>
               <div className='flex space-x-4 items-end'>
                 <div className={`flex-1 mr-2 text-lg  ${TEXT_COLOR[headerResult.status]} font-medium`}>{STATUS[headerResult.status]}</div>
                 <span className="text-sm font-medium mb-0.5 text-gray-500">{formatTimestamp(headerResult.submitted_at)}</span>
               </div>
             </div>
             <div className="">
               <div className='flex justify-around '>
                  {/* Accepted result */}
                  { headerResult.status === 'AC' && (
                   <>
                     <div className="flex-1 mr-2">
                       <div className='example-card'>
                         <pre>
                           <div className="flex items-center">
                             <div className='rounded p-[3px] text-lg mr-1'>
                               <MdOutlineTimer />
                             </div>
                             <div>Runtime</div>
                           </div>
                           <strong className='px-[3px] text-white text-2xl'>{headerResult.runtime}</strong><small>ms</small><br />
                           <small className="text-white"><span className="text-dark-green-s">Beats <span className='font-bold'>{parseInt(headerResult.percentage.runtimeRankRatio)}% </span></span>of users with {COMPILE_LANGUAGE[headerResult.language]}</small>
                         </pre>
                       </div>
                     </div>
                     <div className="flex-1 ml-2">
                       <div className='example-card'>
                         <pre>
                           <div className="flex items-center">
                             <div className='rounded p-[3px] text-lg mr-1'>
                               <MdMemory />
                             </div>
                             <div>Memory</div>
                           </div>
                           <strong className='px-[3px] text-white text-2xl'>{headerResult.memory}</strong><small>MB</small><br />
                           <small className="text-white"><span className="text-dark-green-s">Beats <span className='font-bold'>{parseInt(headerResult.percentage.memoryRankRatio)}% </span></span>of users with {COMPILE_LANGUAGE[headerResult.language]}</small>
                         </pre>
                       </div>
                     </div>
                   </>
                   
                  )}
                  {/* Runtime error */}
                  { headerResult.status === 'RE' && (
                   <>
                     <div className="flex-1">
                       <div className='example-card'>
                         <pre>
                           <div className="flex items-center pb-1">
                             <div className='rounded p-[3px] text-lg mr-1'>
                               <IoBugOutline />
                             </div>
                             <div>Error</div>
                           </div>
                           <div className="whitespace-pre-line">
                             <small>{headerResult.error.trim()}</small>
                           </div>
                         </pre>
                       </div>
                     </div>
                   </>
                  )}
                  {/* Wrong Answer */}
                  { headerResult.status === 'WA' && (
                   <>
                     <div className="flex-1">
                       <div className='example-card'>
                       { headerResult.error.map((item, index) => (
                         <pre key={index}>
                           <div className='px-3'>
                             <small>Input:</small>
                             <MDEditor.Markdown 
                               source={item.WA?.testInput || item.AC?.testInput}
                               className="bg-transparent"
                             />
                           </div>
                           <div className="px-3">
                             <small>Expected Output:</small>
                             <MDEditor.Markdown 
                               source={item.WA?.expectedOutput || item.AC?.expectedOutput}
                               className="bg-transparent"
                             />
                           </div>
                           <div className="px-3">
                             <small>Your Output:</small>
                             <MDEditor.Markdown 
                               source={item.WA?.realOutput || item.AC?.realOutput}
                               className="bg-transparent"
                             />
                           </div>
                         </pre>
                       ))}
                       </div>
                     </div>
                   </>
                  )}
                  { headerResult.status === 'TLE' && (
                    <div className="rounded-lg py-4 flex items-center justify-center">
                      <img src='/timelimiterror.jpeg' className="rounded-lg w-2/3" />
                      
                    </div>
                  )}
                 
               </div>
   
             </div>
         </>
       )}
       </div>
   
         
          
        {/* history table */}
        <div className='overflow-y-auto'>
          <table className=' table-fixed text-left text-gray-500 dark:text-gray-400 sm:w-7/12 w-full max-w-[1200px] mx-auto'>
            <thead className='text-sm text-gray-700 dark:text-gray-400 border-y border-gray-400'>
              <tr>
                <th scope='col' className='px-4 py-3 w-32 font-medium'>
                  Status
                </th>
                <th scope='col' className='px-5 py-3 w-32 font-medium'>
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