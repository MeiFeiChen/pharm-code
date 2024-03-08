import PropTypes from 'prop-types'
import { useState } from 'react'
import { Spinner } from 'flowbite-react'
import { RxDotFilled } from "react-icons/rx"
import { STATUS } from '../../../../constant'


DatabaseTestCasesResult.propTypes = {
  testResult: PropTypes.object, 
  testLoading: PropTypes.bool.isRequired
}

function DatabaseTestCasesResult({ testResult, testLoading }) {
  const [activeTestResultId, setActiveTestResultId] = useState(0)
  return (
    <>
    {/* Loading */}
    { testLoading && (
      <div className='flex items-center justify-center text-sm h-full pb-[26px]'>
        <Spinner color="gray" size="xl"/>
      </div>
    )}

    {/* no result */}
    { !testResult && (
      <div className='flex items-center justify-center h-full pb-[26px] text-dark-gray-6'>
        You must run your code first
      </div>

    )
    }

    {/* test result is AC or WA */}
    { testResult && (testResult.status === 'WA' || testResult.status === 'AC') && (
      <>
      <div className='text-sm py-2'>
      <div className={`text-lg ${testResult.status === 'WA'? 'text-dark-pink': 'text-dark-green-s'}`}>{STATUS[testResult.status]}</div>
      <div className='flex'>
         { testResult.results.map((example, index) => (
           <div
             className='mr-2 items-start mt-2 '
             key={index}
             onClick={() => setActiveTestResultId(index)}
           >
           <div className='flex flex-wrap items-center gap-y-4'>
             <div
               className={`font-medium items-center transition-all focus:outline-none inline-flex bg-dark-fill-3 hover:bg-dark-fill-2 relative rounded-lg pl-2 pr-4 py-1 cursor-pointer whitespace-nowrap
               ${activeTestResultId === index ? "text-white" : "text-gray-500"}
             `}
             >
              <RxDotFilled className={`${example.status === 'WA'? 'text-dark-pink': 'text-dark-green-s'}`}/> Case {index + 1}
             </div>
           </div>
       </div>
       ))}
     </div>
     <div className='font-semibold my-4'>
       <p className='text-sm font-medium mt-4 text-white'>Input:</p>
       <div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2'>
       { Object.keys(testResult.results[activeTestResultId].testInput).map((key, index) => (
        <div key={index} className="text-xs">
          <div className="my-2">Table: <code>{key}</code></div>
          <pre className="whitespace-pre-wrap" style={{fontSize: '1em', lineHeight:'1.2em'}}>
          { testResult.results[activeTestResultId].testInput[key] }
          </pre>
        </div>
      ))}
       </div>
       <p className='text-sm font-medium mt-4 text-white'>Your Output:</p>
       <div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2'>
        <pre className="whitespace-pre-wrap" style={{fontSize: '1em', lineHeight:'1.2em'}}>
          { testResult.results[activeTestResultId].realOutput  }
        </pre>
       </div>
       <p className='text-sm font-medium mt-4 text-white'>Expected:</p>
       <div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2'>
        <pre className="whitespace-pre-wrap" style={{fontSize: '1em', lineHeight:'1.2em'}}>
          { testResult.results[activeTestResultId].expectedOutput  }
        </pre>
       </div>
     </div>
     </div>
     </>
    )}
    { testResult && (testResult.status === 'RE') && (
      <>
      <div className='text-sm py-2'>
        <div className='text-lg text-dark-pink'>{STATUS[testResult.status]}</div>
        <div className="flex-1">
          <div className='example-card' >
            <pre style={{  margin:'4px 0' }}>
              <div className="whitespace-pre-line text-dark-pink">
                <small>{testResult.results[0]}</small>
              </div>
            </pre>
          </div>
        </div>
      </div>
     </>
    )}
        { testResult && (testResult.status === 'TLE') && (
      <>
      <div className='text-sm py-2'>
        <div className='text-lg text-dark-pink'>{STATUS[testResult.status]}</div>
      </div>
     </>
    )}
  </>
  )
}

export default DatabaseTestCasesResult