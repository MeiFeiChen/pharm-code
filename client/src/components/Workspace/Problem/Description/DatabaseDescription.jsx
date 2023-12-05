import WorkSpaceTab from "../../WorkSpaceTab"
import { useState, useEffect, useContext } from "react"
import { BsCircle, BsCheck2Circle } from "react-icons/bs"
import PropTypes from 'prop-types'
import { apiUserSubmissionItems } from '../../../../api'
import { TEXT_COLOR_DIFFICULTY_TAG } from '../../../../constant'
import { AuthContext } from '../../../../context'
import { getAuthToken } from '../../../../utils'

DatabaseDescription.propTypes = {
  problem: PropTypes.object.isRequired,
}

export default function DatabaseDescription( { problem } ) {
  const { isLogin, setIsLogin, setUserProfile } = useContext(AuthContext)
  const [solvedProblem, setSolvedProblem] = useState({})
  // const [loading, setLoading] = useState(true)


  // console.log(problem)
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
	
			<div className='flex px-0 py-4 h-[calc(100vh-94px)] overflow-y-auto'>
				<div className='px-5 w-full'>
					{/* Problem heading */}
					
						<div className='flex space-x-4'>
							<div className='flex-1 mr-2 text-lg text-white font-medium'>{problem.id}. {problem.title}</div>
						</div>
            
						<div className='flex items-center mt-3'>
							<div
								className={`${TEXT_COLOR_DIFFICULTY_TAG[problem.difficulty]}  inline-block rounded-[21px] bg-opacity-[.15] px-2.5 py-1 text-xs font-medium capitalize `}
							>
								{problem.difficulty}
							</div>
              {isLogin && (
                  solvedProblem?.solved && solvedProblem.solved.includes(problem.id) ? (
                    <div className='rounded p-[3px] ml-4 text-lg text-dark-green-s'>
                      <BsCheck2Circle />
                    </div>
                  ) : (
                    solvedProblem?.attempt && solvedProblem.attempt.includes(problem.id) ? (
                      <div className='rounded p-[3px] ml-4 text-lg text-gray-400'>
                        <BsCircle />
                      </div>
                    ) : null
                  )
                )}
						</div>

						{/* Problem Statement(paragraphs) */}
						<div className='text-white text-xs'>
							<div className='mt-3'>
                <pre className="whitespace-pre-wrap">
								{problem.problem_statement}
                </pre>
							</div>
							<div className='mt-3'>
                <strong className=" text-gray-400">Input: </strong> 
                {Object.keys(problem.input).map((key, index) => (
                  <div key={index} className="">
                    <div className="my-2">Table: <code>{key}</code></div>
                    <pre className=''>
                     {problem.input[key]}
                    </pre>
                  </div>
                ))}
							</div>
              <div className='mt-3'>
                <strong className=" text-gray-400">Output: </strong>
                <div>
                  {problem.output}
                </div>
							</div>
						</div>

						{/* Examples */}
						<div className='mt-4 text-xs'>
            { problem.exampleCases?.map((example, index) => (
                <div key={index}>
                  <p className='font-medium text-white'>Example {index + 1}: </p>
                  <div className='example-card'>
                    <pre className="flex flex-col">
                      <div className="w-full">
                      <strong className='text-white'>Input: </strong> <br />
                      { Object.keys(example.test_input).map((key, index) => (
                        <div key={index} className="text-xs">
                          <div className="my-2">Table: <code>{key}</code></div>
                          <pre className='' style={{fontSize: '1em', lineHeight:'1.2em', background:'transparent', padding: '0px'}}>
                          {example.test_input[key]}
                          </pre>
                        </div>
                      ))}
                      </div>
                      <div className="w-full text-xs">
                      <strong className='text-white '>Output: </strong> <br />
                      <pre className='' style={{fontSize: '1em', lineHeight:'1.2em', background:'transparent', padding: '0px'}}>
                        {example.expected_output}
                      </pre>
                      
                      </div>
                    </pre>
                  </div>
                </div>
              ))
            }
						</div>
					</div>
				
			</div>
		</div>
	)
}