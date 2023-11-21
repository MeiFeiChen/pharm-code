import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BsCheckCircle } from 'react-icons/bs'
import { apiProblemsItem } from '../../api'

export default function ProblemTable() {
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const solvedProblems = []

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await apiProblemsItem()
        setProblems(data);
      } catch (error) {
        console.error('Error fetching data', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <>
      {loading ? (
        // Loading state
        <p>Loading...</p>
      ) : (
        // Data loaded
        <tbody className='text-white'>
          { problems?.map((problem) => {
            const difficultyColor =
              problem.difficulty === 'easy'
                ? 'text-dark-green-s'
                : problem.difficulty === 'medium'
                ? 'text-dark-yellow'
                : 'text-dark-pink';
            return (
              <tr
                className={`${problem.id % 2 === 1 ? 'bg-dark-layer-1' : ''}`}
                key={problem.id}
              >
                <th className='px-2 py-4 font-medium whitespace-nowrap text-dark-green-s'>
                  {solvedProblems.includes(problem.id) && (
                    <BsCheckCircle fontSize={'18'} width='18' />
                  )}
                </th>

                <td className='px-6 py-4'>
                  <Link to={`/problems/${problem.id}`} className='hover:text-blue-600 cursor-pointer'>
                    {problem.title}
                  </Link>
                </td>
                <td className={`px-6 py-4 ${difficultyColor}`}>{problem.difficulty}</td>
                <td className='px-6 py-4'>{'90%'}</td>
              </tr>
            );
          })}
        </tbody>
      )}
    </>
  );
}
