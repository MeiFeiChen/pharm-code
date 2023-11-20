import WorkSpaceTab from "../WorkSpaceTab"
import { useState, useEffect } from "react"
import { BsCheck2Circle } from "react-icons/bs"
import PropTypes from 'prop-types'


ProblemDescription.propTypes = {
  problem: PropTypes.object.isRequired,
}

export default function ProblemDescription( { problem } ) {
  // const { problemId } = useParams()
  // const [problem, setProblem] = useState([])
  const [problemDifficultyClass, setProblemDifficultyClass] = useState("");
  // const [loading, setLoading] = useState(true)

  useEffect(() => {
        setProblemDifficultyClass(
					problem.difficulty === "easy"
						? "bg-olive text-olive"
						: problem.difficulty === "medium"
						? "bg-dark-yellow text-dark-yellow"
						: " bg-dark-pink text-dark-pink"
				)
    }
  , [problem.difficulty])
  // console.log(problem)


	return (
		<div className='bg-dark-layer-1'>
      <WorkSpaceTab />
	
			<div className='flex px-0 py-4 h-[calc(100vh-94px)] overflow-y-auto'>
				<div className='px-5 w-full'>
					{/* Problem heading */}
					<div className=''>
						<div className='flex space-x-4'>
							<div className='flex-1 mr-2 text-lg text-white font-medium'>{problem.id}. {problem.title}</div>
						</div>
            
						<div className='flex items-center mt-3'>
							<div
								className={`${problemDifficultyClass}  inline-block rounded-[21px] bg-opacity-[.15] px-2.5 py-1 text-xs font-medium capitalize `}
							>
								{problem.difficulty}
							</div>
              <div className='rounded p-[3px] ml-4 text-lg transition-colors duration-200 text-green-s text-dark-green-s'>
								<BsCheck2Circle />
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
                    <pre>
                      <strong className='text-white'>Input: </strong> <br />
                      {example.test_input} <br />
                      <strong className='text-white'>Output: </strong> <br />
                      {example.expected_output} <br />
                    </pre>
                  </div>
                </div>
              ))
            }
						</div>

						{/* Constraints */}
						<div className='my-5'>
							<div className='text-white text-sm font-medium'>Constraints:</div>
							<ul className='text-white ml-5 list-disc'>
								<li className='mt-2 text-sm'>
                  <strong>Memory limit:</strong> <code> {problem.memory_limit} </code> mb
								</li>

                <li className='mt-2 text-sm'>
                  <strong>Time limit: </strong> <code> {problem.time_limit} </code> ms
								</li>
								<li className='mt-2 text-sm'>
                  <strong>I/O mode: </strong> {problem.IO_Mode}
								</li>
								<li className='mt-2 text-sm'>
									<strong>Only one valid answer exists.</strong>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

