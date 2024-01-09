import { MdMemory, MdOutlineTimer } from 'react-icons/md'
import { useNavigate, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import { TEXT_COLOR, STATUS, COMPILE_LANGUAGE } from '../../../../constant'
import { formatTimestamp } from '../../../../dateconfig'

SubmissionTable.propTypes = {
  results: PropTypes.arrayOf(PropTypes.object).isRequired,
}

function SubmissionTable({ results }) {
  const navigate = useNavigate()
  const { submittedId } = useParams()

  const handleClick = (result) => {
    navigate(`/problems/${result.problem_id}/submission/${result.id}`)
  }
  console.log(results)

  return (
    <tbody className="rounded">
      { results?.map((result, index) => {
        return (
          <tr
            className={`${
              result.id === submittedId ? 'bg-dark-layer-3' :
              index % 2 === 1 ? 'bg-dark-layer-1' : 'bg-dark-layer-2'
            } cursor-pointer`}
            onClick={() => handleClick(result, index)}
            key={result.id}
          >

            <th className="px-4 py-1 font-medium whitespace-nowrap">
              <p className={`text-sm ${TEXT_COLOR[result.status]}`}>{STATUS[result.status]}</p>
              <span className="text-[10px]">{formatTimestamp(result.submitted_at)}</span>
            </th>
            <td className="text-sm px-3 py-1">
              <span className="px-2 py-1 rounded-full bg-zinc-700 text-gray-400">
                {COMPILE_LANGUAGE[result.language]}
              </span>
            </td>
            <td className="text-sm px-1 py-1">
              <div className="flex items-center pb-1">
                <div className="rounded p-[3px] mr-1">
                  <MdOutlineTimer />
                </div>
                {result.runtime ? (
                    <>
                      <strong>{result.runtime}</strong>
                      <small>&nbsp;ms</small>
                    </>
                  ) : (
                    <strong>N/A</strong>
                  )}
              </div>
            </td>
            <td className="text-sm px-1 py-1">
              <div className="flex items-center pb-1">
                <div className="rounded p-[3px] mr-1">
                  <MdMemory />
                </div>
                {result.memory ? (
                    <>
                      <strong>{result.memory}</strong>
                      <small>&nbsp;MB</small>
                    </>
                  ) : (
                    <strong>N/A</strong>
                  )}
              </div>
            </td>
          </tr>
        );
      })}
    </tbody>
  );
}

export default SubmissionTable;
