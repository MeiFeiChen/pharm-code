import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { BsCircle, BsCheckCircle } from 'react-icons/bs'
import { apiProblemsItem, apiUserSubmissionItems } from '../../api'
import { TEXT_COLOR_DIFFICULTY } from '../../constant'
import { Progress } from 'flowbite-react';
import { AuthContext } from "../../context"
import { getAuthToken } from '../../utils'


export default function ProblemTable() {
  const { isLogin, setIsLogin, setUserProfile } = useContext(AuthContext)
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const [solvedProblem, setSolvedProblem] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        // fetch problem data
        const { data } = await apiProblemsItem()
        setProblems(data)
        console.log(data)
      } catch (err) {
        console.error('Error fetching data', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])
  console.log(problems)
  

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
    <>
      {loading ? (
        // Loading state
        <p>Loading...</p>
      ) : (
        // Data loaded
        <tbody className='text-white'>
          { problems?.map((problem, index) => {
            return (
              <tr
                className={`${index % 2 === 1 ? 'bg-dark-layer-1' : ''}`}
                key={problem.id}
              >
                <th className='px-2 py-4 font-medium whitespace-nowrap'>
                {isLogin && (
                  solvedProblem?.solved && solvedProblem.solved.includes(problem.id) ? (
                    <div className='solvedBtn group flex'>
                    <BsCheckCircle fontSize={'18'} width='18' className='text-dark-green-s' />
                    <div className='solvedBtn-tooltip'>Solved</div>
                    </div>
                  ) : (
                    solvedProblem?.attempt && solvedProblem.attempt.includes(problem.id) ? (
                      <div className='solvedBtn group flex'>
                      <BsCircle fontSize={'18'} width='18' className='text-gray-400' />
                      <div className='solvedBtn-tooltip'>Attempt</div>
                      </div>
                    ) : null
                  )
                )}
                </th>
                <td className='px-6 py-4'>
                  <Link to={`/problems/${problem.id}`} className='hover:text-blue-600 cursor-pointer'>
                    {problem.title}
                  </Link>
                </td>
                <td className={`px-6 py-4 capitalize ${TEXT_COLOR_DIFFICULTY[problem.difficulty]}`}>{problem.difficulty}</td>
                {/* 通過率 */}
                <td className='px-6 py-4 text-[10px]'>
                { problem.pass_rate ? (
                  <div className='flex items-center'>
                    <Progress 
                      progress={ Math.floor(problem.pass_rate * 100)}
                      progressLabelPosition="inside"
                      color="green" 
                      labelProgress
                      style={{ width: '60%' }}
                    />
                    <div className='ml-2'>
                      {problem.successful_submissions}/{ problem.total_submissions}
                    </div>
                  </div>
                ): (
                  <div>no record</div>
                )}
                </td>
              </tr>
            );
          })}
        </tbody>
      )}
    </>
  );
}
