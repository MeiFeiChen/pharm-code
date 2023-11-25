import TopBar from "../components/TopBar";
import ProblemTable from "../components/problemsTable/ProblemTable";
import PropTypes from 'prop-types'

Problems.propTypes = {
  solvedProblem: PropTypes.object.isRequired,
}

export default function Problems() {

  return (
    <main className='bg-dark-layer-2 min-h-screen'>
      <TopBar />
        <div className='relative overflow-x-auto mx-auto px-6 pb-10'>
          <table className='text-left text-gray-500 dark:text-gray-400 sm:w-7/12 w-full max-w-[1200px] mx-auto'>
            <thead className='text-xs text-gray-700 uppercase dark:text-gray-400 border-b '>
              <tr>
                <th scope='col' className='px-2 py-3 w-0 font-medium'>
                  Status
                </th>
                <th scope='col' className='px-6 py-3 w-0 font-medium'>
                  Title
                </th>
                <th scope='col' className='px-6 py-3 w-0 font-medium'>
                  Difficulty
                </th>
                <th scope='col' className='px-6 py-3 w-0 font-medium'>
                  Acceptance
                </th>
              </tr>
            </thead>
            <ProblemTable />
          </table>
        </div>
    </main>

  );
}
