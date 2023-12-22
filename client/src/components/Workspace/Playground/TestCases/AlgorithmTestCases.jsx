import PropTypes from 'prop-types'
import { useState } from 'react'
import MDEditor from '@uiw/react-md-editor'

AlgorithmTestCases.propTypes = {
  testCases: PropTypes.array
}

function AlgorithmTestCases({ testCases }) {
  const [activeTestCaseId, setActiveTestCaseId] = useState(0)
  return (
    <>
      <div className='flex text-sm'>
        { testCases?.map((example, index) => (
          <div
            className='mr-2 items-start mt-2 '
            key={index}
            onClick={() => setActiveTestCaseId(index)}
          >
          <div className='flex flex-wrap items-center gap-y-4'>
            <div
              className={`font-medium items-center transition-all focus:outline-none inline-flex bg-dark-fill-3 hover:bg-dark-fill-2 relative rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap
              ${activeTestCaseId === index ? "text-white" : "text-gray-500"}
            `}
            >
              Case {index + 1}
            </div>
          </div>
      </div>
      ))}
    </div>
    <div className='font-semibold my-4'>
      <p className='text-sm font-medium mt-4 text-white'>Input:</p>
      <div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2'>
        
        <MDEditor.Markdown 
          source={testCases && testCases[activeTestCaseId].test_input}
          className="bg-transparent text-sm text-white" />
      </div>
    </div>
    </>
  )
}

export default AlgorithmTestCases