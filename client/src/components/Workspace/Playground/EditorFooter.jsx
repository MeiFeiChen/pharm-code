import { BsChevronUp } from "react-icons/bs"
import PropTypes from 'prop-types'
import { AuthContext } from "../../../context"
import { useContext } from "react"

EditorFooter.propTypes = {
  isExpanded: PropTypes.bool.isRequired,
  handleToggleHeight: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleTestSubmit: PropTypes.func.isRequired,
  disabledButton: PropTypes.bool.isRequired,
  code: PropTypes.string.isRequired
}

function EditorFooter( { isExpanded, handleToggleHeight, handleSubmit, handleTestSubmit, disabledButton, code }) {
  const { isLogin } = useContext(AuthContext)

  return (
    <div className='flex bg-dark-layer-1 absolute bottom-0 w-full overflow-x-auto'>
			<div className='mx-5 my-[10px] flex justify-between w-full'>
				<div className='mr-2 flex flex-1 flex-nowrap items-center space-x-4'>
					<button 
            className='px-3 py-1.5 font-medium items-center transition-all inline-flex bg-dark-fill-3 text-sm hover:bg-dark-fill-2 text-dark-label-2 rounded-lg pl-3 pr-2'
            onClick={handleToggleHeight}
          >
						Console
						<div className='ml-1 transform transition flex items-center'>
							<BsChevronUp className={`fill-gray-6 mx-1 fill-dark-gray-6 transition-transform duration-300 ${isExpanded? 'rotate-0': 'rotate-180'}`} />
						</div>
					</button>
				</div>
				<div className='ml-auto flex items-center space-x-4 '>
					<button
						className={`
              px-3 py-1.5 text-dark-label-2 rounded-lg text-sm font-medium items-center whitespace-nowrap transition-all focus:outline-none 
              inline-flex 
              ${(!isLogin || !code) ? 'bg-dark-gray-6 cursor-not-allowed': 
              (disabledButton)? 'bg-[#353335] hover:bg-[#353335] cursor-not-allowed':' bg-dark-fill-3  hover:bg-dark-fill-2 '}
              `}
						onClick={ handleTestSubmit }
            disabled= { !isLogin || !code || disabledButton }
					>
            <div>Run</div>
					</button>

          <button
            className={`
            px-3 py-1.5 font-medium items-center transition-all 
            focus:outline-none inline-flex text-sm text-dark-label-2 rounded-lg
            ${(!isLogin || !code) ? 'bg-dark-gray-6 cursor-not-allowed' : 
            (disabledButton)?'bg-[#1b7038] hover:bg-[#1b7038] cursor-not-allowed':'text-white bg-[#2CBB5D] hover:bg-light-green-s'}
            `}
            onClick={ handleSubmit }
            disabled= { !isLogin || !code || disabledButton }
          >
            Submit
          </button>
          
				</div>
			</div>
		</div>
  )
}

export default EditorFooter