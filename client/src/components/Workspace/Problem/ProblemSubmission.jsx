import { useLocation, useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import WorkSpaceTab from "../WorkSpaceTab"
import { MdOutlineTimer, MdMemory } from "react-icons/md"
import { BsCheck2Circle } from "react-icons/bs"
import { IoIosCloseCircleOutline } from "react-icons/io"
import { IoBugOutline } from "react-icons/io5";
import SubmissionTable from "../SubmissionTable/SubmissionTable"
import { apiProblemSubmissionItems } from "../../../api"
import { TEXT_COLOR, COMPILE_LANGUAGE, STATUS } from "../../../constant"
import { formatTimestamp } from '../../../config';



export default function ProblemSubmission() {
  const location = useLocation()
  const { problemId, submittedId } = useParams()
  
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [headerResult, setHeaderResult] = useState(results[0])

  const recentResult = location.state?.submissionResult

  useEffect(() => {
    const fetchData = async() => {
      try {
        const { data } = await apiProblemSubmissionItems(problemId)
        if (!submittedId) setHeaderResult(data.data[0])
        setResults(data.data)
      } catch(error) {
        console.error('Error fetching data', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problemId, recentResult])
  console.log(headerResult)

  


  
	return (
    <div className='bg-dark-layer-1'>
      <WorkSpaceTab />
      <div className='flex flex-col px-0 py-4 h-[calc(100vh-94px)] '>
      { headerResult && (
        <div className='px-5 w-full'>
          {/* The newest submission result */}
          <div className='flex items-center mt-3'>
            <div className={`rounded p-[3px] text-lg mr-1 ${TEXT_COLOR[headerResult.status]}`}>
            {headerResult.status === 'success' ? <BsCheck2Circle /> : <IoIosCloseCircleOutline />}
            </div>
            <div className='flex space-x-4 items-end'>
              <div className={`flex-1 mr-2 text-lg  ${TEXT_COLOR[headerResult.status]} font-medium`}>{STATUS[headerResult.result]}</div>
              <span className="text-sm font-medium mb-0.5 text-gray-500">{formatTimestamp(headerResult.submitted_at)}</span>
            </div>
          </div>
          <div className="">
            <div className='flex justify-around h-[230px] overflow-y-auto'>
               {/* Accepted result */}
               { headerResult.result === 'AC' && (
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
                        <small className="text-white"><span className="text-dark-green-s">Beats <span className='font-bold'>71.87% </span></span>of users with {headerResult.language === 'js'? 'Javascript': 'Python'}</small>
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
                        <small className="text-white"><span className="text-dark-green-s">Beats <span className='font-bold'>71.87% </span></span>of users with {headerResult.language === 'js'? 'Javascript': 'Python'}</small>
                      </pre>
                    </div>
                  </div>
                </>
                
               )}
               {/* Runtime error */}
               { headerResult.result === 'RE' && (
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
                          <small>{headerResult.error}</small>
                        </div>
                      </pre>
                    </div>
                  </div>
                </>
               )}
              
            </div>

          </div>

          <hr className="h-px bg-gray-800 border-0 dark:bg-gray-700" />
        </div>
    )}

      
       
        {/* history table */}
        <div className='overflow-y-auto'>
          <table className=' table-fixed text-left text-gray-500 dark:text-gray-400 sm:w-7/12 w-full max-w-[1200px] mx-auto'>
            <thead className='text-sm text-gray-700 dark:text-gray-400 border-b'>
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
            <SubmissionTable 
              results={results}
              setHeaderResult={setHeaderResult}/>
            
          
          </table>
        </div>
        
        
      </div>
      

    </div>
	)
}