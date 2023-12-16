import { useState } from "react"
import Split from 'react-split'
import ProblemDescription from './Problem/ProblemDescription'
import ProblemSubmission from './Problem/ProblemSubmission'
import ProblemDiscussion from './Problem/ProblemDiscussion'
import { Route, Routes } from 'react-router-dom'
import Playground from './Playground/Playground'
import { CodeContext } from "../../context"
import PropTypes from 'prop-types'

WorkSpace.propTypes = {
  problem: PropTypes.object.isRequired
}


export default function WorkSpace({ problem }) {  
  const [ code, setCode ] = useState('')

  return (
    <CodeContext.Provider value={{code, setCode}}>
    <Split className='split' minSize={0}>
      <div className="bg-[#1A1A1A]">
        
        <Routes>
          <Route path='' element={<ProblemDescription problem={problem}/>}/>
          <Route path={`submission/:submittedId?`} element={<ProblemSubmission problem={problem}/>}/>
          <Route path='discussion/*' element={<ProblemDiscussion />}/>
        </Routes>
        
      </div>
      <Playground problem={ problem } key='problem'/>
    </Split>
    </CodeContext.Provider>
  )
}
