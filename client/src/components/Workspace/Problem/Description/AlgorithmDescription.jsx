import WorkSpaceTab from "../../WorkSpaceTab"
import { useState, useEffect, useContext } from "react"
import { BsCircle, BsCheck2Circle } from "react-icons/bs"
import PropTypes from 'prop-types'
import MDEditor from '@uiw/react-md-editor'
import { apiUserSubmissionItems } from '../../../../api'
import { TEXT_COLOR_DIFFICULTY_TAG } from '../../../../constant'
import { AuthContext } from '../../../../context'
import { getAuthToken } from '../../../../utils'

AlgorithmDescription.propTypes = {
  problem: PropTypes.object.isRequired,
}

export default function AlgorithmDescription( { problem } ) {
  const { isLogin, setIsLogin, setUserProfile } = useContext(AuthContext)
  const [solvedProblem, setSolvedProblem] = useState({})
  // const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserSubmissionData = async (config) => {
      try {
        const { data } = await apiUserSubmissionItems(config)
        if (data.length) {
          const transformedData = data.reduce((acc, item) => {
          const key = item.statuses.includes('AC') ? 'solved' : 'attempt'
          acc[key].push(item.problem_id)
          return acc;
          }, { solved: [], attempt: [] })
          setSolvedProblem(transformedData)
        }
      } catch (err) {
        console.error('Error fetching user submission data', err)
        setIsLogin(false)
        setUserProfile(null)
        setSolvedProblem({})
      } 
    }
    if (isLogin) {
      const token = getAuthToken()
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      }
      fetchUserSubmissionData(config)
    }
  }, [isLogin, setSolvedProblem, setIsLogin, setUserProfile])


	return (
		<div className='bg-dark-layer-1'>
      <WorkSpaceTab />
	
			<div className='flex flex-col px-0 py-4 h-[calc(100vh-94px)] overflow-y-auto'>
				<div className='px-5 w-full'>
					{/* Problem heading */}
					
						<div className='space-x-4'>
							<div className='mr-2 text-lg text-white font-medium'>{problem.id}. {problem.title}</div>
						</div>
            
						<div className='flex items-center mt-3'>
							<div
								className={`${TEXT_COLOR_DIFFICULTY_TAG[problem.difficulty]}  inline-block rounded-[21px] bg-opacity-[.15] px-2.5 py-1 text-xs font-medium capitalize `}
							>
								{problem.difficulty}
							</div>
              <div>
              {isLogin && (
                  solvedProblem?.solved && solvedProblem.solved.includes(problem.id) ? (
                    <div className="solvedBtn group flex">
                    <div className='rounded px-[3px] text-lg text-dark-green-s'>
                      <BsCheck2Circle /> 
                    </div>
                    <div className='solvedBtn-tooltip'>Solved</div>
                    </div>
                  ) : (
                    solvedProblem?.attempt && solvedProblem.attempt.includes(problem.id) ? (
                      <div className="solvedBtn group flex">
                      <div className='rounded px-[3px] text-lg text-gray-400'>
                        <BsCircle />
                      </div>
                      <div className='solvedBtn-tooltip'>Attempt</div>
                      </div>
                    ) : null
                  )
                )}
              </div>
						</div>

						{/* Problem Statement(paragraphs) */}
						<div className='text-white text-sm'>
							<p className='mt-3'>
								{problem.problem_statement}
							</p>
							<p className='mt-3'>
                <strong className=" text-gray-400">Input: </strong> {problem.input}
							</p>
              <p className='mt-3'>
                <strong className=" text-gray-400">Output: </strong> {problem.output}
							</p>
						</div>

						{/* Examples */}
						<div className='mt-4'>
            { problem.exampleCases?.map((example, index) => (
                <div key={index}>
                  <p className='font-medium text-white'>Example {index + 1}: </p>
                  <div className='example-card'>
                    <pre className="flex">
                      <div className="w-1/2">
                      <strong className='text-white'>Input: </strong> <br />
                      <MDEditor.Markdown 
                        source={example.test_input}
                        className="bg-transparent text-gray-300"
                      />
                      </div>
                      <div className="w-1/2">
                      <strong className='text-white'>Output: </strong> <br />
                      <MDEditor.Markdown 
                        source={example.expected_output}
                        className="bg-transparent text-gray-300"
                      />
                      </div>
                    </pre>
                  </div>
                </div>
              ))
            }
						</div>

						{/* Constraints */}
						<div className='my-5 pb-4'>
							<div className='text-white text-sm font-medium'>Constraints:</div>
							<ul className='text-white ml-5 list-disc'>
								<li className='mt-2 text-sm'>
                  <strong>Memory limit:</strong> <code> {problem.memory_limit} </code> mb
								</li>

                <li className='mt-2 text-sm'>
                  <strong>Time limit: </strong> <code> {problem.time_limit} </code> ms
								</li>
								<li className='mt-2 text-sm'>
                  <strong>I/O mode: </strong> {problem.io_mode}
								</li>
								<li className='mt-2 text-sm'>
									<strong>Only one valid answer exists.</strong>
								</li>
							</ul>
						</div>
					</div>
				
			</div>
		</div>
	)
}
