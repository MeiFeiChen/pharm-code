import { MdMemory, MdOutlineTimer } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

SubmissionTable.propTypes = {
  results: PropTypes.arrayOf(PropTypes.object).isRequired,
};

function SubmissionTable({ results }) {
  const navigate = useNavigate();

  const handleClick = (problemId, submittedId) => {
    navigate(`/problems/${problemId}/submission/${submittedId}`);
  };

  return (
    <tbody className="rounded">
      { results.map((result) => {
        const statusColor =
          result.status === 'success' ? 'text-dark-green-s' : 'text-dark-pink';
        const status =
          result.result === 'AC'
            ? 'Accepted'
            : result.result === 'RE'
            ? 'Runtime Error'
            : result.result === 'TLE'
            ? 'Time Limit Error'
            : 'Wrong Answer';
        const compileLanguage =
          result.language === 'js' ? 'Javascript' : 'Python';

        return (
          <tr
            className={`${
              result.id % 2 === 1 ? 'bg-dark-layer-1' : 'bg-dark-layer-2'
            } cursor-pointer`}
            onClick={() => handleClick(result.problem_id, result.id)}
            key={result.id}
          >
            <th className="px-4 py-1 font-medium whitespace-nowrap">
              <p className={`text-sm ${statusColor}`}>{status}</p>
              <span className="text-[10px]">{result.submitted_at}</span>
            </th>
            <td className="text-sm px-3 py-1">
              <span className="px-2 py-1 rounded-full bg-zinc-700 text-white">
                {compileLanguage}
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
