import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { apiProblemItem } from "../../api"
import Split from 'react-split'
import ProblemDescription from './Problem/ProblemDescription'
import ProblemSubmission from './Problem/ProblemSubmission'
import ProblemDiscussion from './Problem/ProblemDiscussion'
import { Route, Routes } from 'react-router-dom'
import Playground from './Playground/Playground'
import { CodeContext } from "../../context"


export default function WorkSpace() {  
  const [ code, setCode ] = useState('')
  const { problemId } = useParams()
  const [problem, setProblem] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data }  = await apiProblemItem(problemId)
        setProblem(data.data)
      } catch (error) {
        console.error('Error fetching data', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [problemId])

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
