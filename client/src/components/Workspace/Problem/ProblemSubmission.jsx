import { useLocation, useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import WorkSpaceTab from "../WorkSpaceTab"
import { MdOutlineTimer } from "react-icons/md"
import { BsCheck2Circle } from "react-icons/bs"
import { MdMemory } from "react-icons/md"
import SubmissionTable from "../SubmissionTable/SubmissionTable"
import { apiProblemSubmissionItems } from "../../../api"



export default function ProblemSubmission() {
  const location = useLocation()
  const { problemId } = useParams()
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const submissionResult = location.state?.submissionResult
  useEffect(() => {
    const fetchData = async() => {
      try {
        const { data } = await apiProblemSubmissionItems(problemId)
        setResults(data.data)
      } catch(error) {
        console.error('Error fetching data', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [problemId, submissionResult])

  
	return (
    <div className='bg-dark-layer-1'>
      <WorkSpaceTab />
      <div className='flex flex-col px-0 py-4 h-[calc(100vh-94px)] overflow-y-auto'>
      { submissionResult && (
        <div className='px-5 w-full'>
          {/* The newest submission heading */}
          <div className='flex items-center mt-3'>
            <div className='rounded p-[3px] text-lg mr-1 text-green-s text-dark-green-s'>
              <BsCheck2Circle />
            </div>
            <div className='flex space-x-4'>
              <div className='flex-1 mr-2 text-lg text-dark-green-s font-medium'>Accepted</div>
            </div>
          </div>
          {/* The newest submission result */}
          <div className="">
            <div className='flex justify-around'>
              <div className="flex-1 mr-2">
                <div className='example-card'>
                  <pre>
                    <div className="flex items-center pb-1">
                      <div className='rounded p-[3px] text-lg mr-1'>
                        <MdOutlineTimer />
                      </div>
                      <div>Runtime</div>
                    </div>
                    <strong className='px-[3px] text-white text-2xl'>{submissionResult.runtime}</strong><small>ms</small><br />
                    <small className="text-white"><span className="text-dark-green-s">Beats <span className='font-bold'>71.87% </span></span>of users with {submissionResult.language === 'js'? 'Javascript': 'Python'}</small>
                  </pre>
                </div>
              </div>
              <div className="flex-1 ml-2">
                <div className='example-card'>
                  <pre>
                    <div className="flex items-center pb-1">
                      <div className='rounded p-[3px] text-lg mr-1'>
                        <MdMemory />
                      </div>
                      <div>Memory</div>
                    </div>
                    <strong className='px-[3px] text-white text-2xl'>{submissionResult.memory}</strong><small>MB</small><br />
                    <small className="text-white"><span className="text-dark-green-s">Beats <span className='font-bold'>71.87% </span></span>of users with {submissionResult.language === 'js'? 'Javascript': 'Python'}</small>
                  </pre>
                </div>
              </div>
            </div>

          </div>

          <hr className="h-px bg-gray-800 border-0 dark:bg-gray-700" />
        </div>
    )}

      
       
        {/* history table */}
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
          <SubmissionTable results={results}/>
          
        
        </table>
        
        
      </div>
      

    </div>
	)
}