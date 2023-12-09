import PropTypes from 'prop-types'
import MDEditor from '@uiw/react-md-editor'
import { Spinner } from 'flowbite-react'

CodeReview.propTypes = {
  handleAiReview: PropTypes.func.isRequired,
  aiReview: PropTypes.string,
  aiLoading: PropTypes.bool.isRequired
}


function CodeReview({ handleAiReview, aiReview, aiLoading }) {


  return (
    <>
     {aiReview && !aiLoading && (
      <>
      <div className='p-2 text-sm'>
        <MDEditor.Markdown 
          source={aiReview}
          className="bg-transparent text-sm text-white" />
      </div>
      <div className='p-2 text-xs text-dark-gray-6'> This response is generated by AI and does not guarantee absolute accuracy. </div>
       <div className='p-2 flex items-center justify-center text-dark-gray-8'>
       <button
         className='bg-dark-fill-3 py-1 px-3 cursor-pointer rounded 
         hover:text-white hover:bg-brand-orange hover:border-2 hover:border-brand-orange border-2 border-transparent
         transition duration-300 ease-in-out'
         onClick={handleAiReview}
       >
         Review again
       </button>
     </div>
     
     </>
    )}

    {aiLoading && (
      <div className='flex items-center justify-center p-2 text-sm h-full pb-[26px]'>
        <Spinner color="gray" size="xl"/>
      </div>
    )}

    {aiReview === null && !aiLoading && (
      <div className='flex items-center justify-center h-full pb-[26px] text-dark-gray-8'>
        <button
          className='bg-dark-fill-3 py-1 px-3 cursor-pointer rounded 
          hover:text-white hover:bg-brand-orange hover:border-2 hover:border-brand-orange border-2 border-transparent
          transition duration-300 ease-in-out'
          onClick={handleAiReview}
        >
          AI Code Review
        </button>
      </div>
    )}

    </>
   
  )
}

export default CodeReview