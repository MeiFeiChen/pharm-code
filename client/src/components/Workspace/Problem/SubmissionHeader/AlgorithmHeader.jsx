import PropTypes from 'prop-types'
import { BsCheck2Circle } from "react-icons/bs"
import { IoIosCloseCircleOutline } from "react-icons/io"
import { IoBugOutline } from "react-icons/io5"
import { TEXT_COLOR, COMPILE_LANGUAGE, STATUS } from "../../../../constant"
import { formatTimestamp } from '../../../../dateconfig'
import { MdOutlineTimer, MdMemory } from "react-icons/md"
import MDEditor from '@uiw/react-md-editor'

AlgorithmHeader.propTypes = {
  headerResult: PropTypes.object.isRequired,
}

function AlgorithmHeader({ headerResult }) {
  return (
    <>
      {/* The newest submission result */}
      <div className='flex items-center'>
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
                <div className='example-card '>
                  <pre>
                    <div className="flex items-center pb-1 text-dark-pink">
                      <div className='rounded p-[3px] text-lg mr-1'>
                        <IoBugOutline />
                      </div>
                      <div>Error</div>
                    </div>
                    <div className="whitespace-pre-line text-dark-pink">
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
                {headerResult.error.map((item, index) => (
      
                      <pre 
                        // style={{ backgroundColor: item.status === 'WA' ? 'hsla(0, 100%, 50%, 0.1)' : 'hsla(168, 100%, 50%, 0.1)' }} 
                        className="flex flex-wrap"
                        key={index}
                      >
                        <div className='w-1/3'>
                          <small>Input:</small>
                          <MDEditor.Markdown 
                            source={item.testInput}
                            className="bg-transparent"
                          />
                        </div>
                        <div className="w-2/3">
                          <small>Expected Output:</small>
                          <MDEditor.Markdown 
                            source={item.expectedOutput}
                            className={`bg-transparent ${item.status === 'WA' ? 'text-dark-pink': 'text-dark-green-s'}`}
                          />
                        </div>
                        <div className="w-1/3">
                  
                        </div>
                        <div className="w-2/3">
                          <small>Your Output:</small>
                          <MDEditor.Markdown 
                            source={item.realOutput}
                            className={`bg-transparent ${item.status === 'WA' ? 'text-dark-pink': 'text-dark-green-s'}`}
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
              <img src={`/timelimiterror.jpeg`} className="rounded-lg w-2/3" />
              
            </div>
          )}
          
        </div>

      </div>
  </>
  )
}

export default AlgorithmHeader