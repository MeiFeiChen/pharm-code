import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { apiProblemItem } from "../../api"
import Split from 'react-split'
import ProblemDescription from './Problem/ProblemDescription'
import ProblemSubmission from './Problem/ProblemSubmission'
import ProblemDiscussion from './Problem/ProblemDiscussion'
import { Route, Routes } from 'react-router-dom'
import Playground from './Playground/Playground'



export default function WorkSpace() {  
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
    <Split className='split' minSize={0}>
      <div>
      <Routes>
        <Route path='' element={<ProblemDescription problem={problem}/>}/>
        <Route path={`submission/:submittedId?`} 
          element={<ProblemSubmission />}/>
        <Route path='discussion' element={<ProblemDiscussion />}/>
      </Routes>
      </div>
      
      <Playground problem={ problem } key='problem'/>
      

    </Split>
  )
}
