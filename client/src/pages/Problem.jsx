import { useParams} from 'react-router-dom'
import { useState, useEffect } from 'react'
import TopBar from '../components/TopBar'
import WorkSpace from '../components/Workspace/WorkSpace'
import Post from './Post'
import { PostContext } from '../context'
import { apiProblemItem } from '../api'


export default function Problem() {
  const { problemId } = useParams()
  const [ newPostId, setNewPostId ] = useState(0)
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
    <div className='overflow-hidden'>
    <PostContext.Provider value={{ newPostId, setNewPostId }}>
      <TopBar problemPage lastProblemId={ problem?.last_problem_id } nextProblemId={ problem?.next_problem_id} />
      <WorkSpace problem={ problem }/>
      <Post />
    </PostContext.Provider>
    </div>
  )
}