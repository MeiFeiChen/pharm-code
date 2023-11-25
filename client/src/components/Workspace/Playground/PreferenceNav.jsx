import { AiOutlineFullscreen, AiOutlineFullscreenExit, AiOutlineSetting } from "react-icons/ai"
import PropTypes from 'prop-types'

PreferenceNav.propTypes = {
  handleLanguageExtension: PropTypes.func.isRequired,
  setDefaultLanguage: PropTypes.func.isRequired, 
  language: PropTypes.string.isRequired
}

function PreferenceNav({ handleLanguageExtension, setDefaultLanguage, language}) {
  return (
    <div className='flex items-center justify-between bg-dark-layer-2 h-11 w-full '>
      {/* language */}
			<div className='flex items-center text-white'>
        <select
          value={language}
          className=
            {`cursor-pointer items-center rounded focus:outline-none bg-dark-fill-3 
              text-dark-label-2 hover:bg-dark-fill-2  px-2 py-1.5 font-medium h-8 `}
          onChange={(e) => {
            handleLanguageExtension(e.target.value)
          }}
        >
          <option value='js'>Javascript</option>
          <option value='py'>Python</option>
        </select>
        <button 
          className=
              {`cursor-pointer items-center rounded focus:outline-none bg-dark-fill-3
                flex justify-center text-dark-label-2 hover:bg-dark-fill-2  px-2 py-1.5
                font-medium h-8 ml-3`}
          onClick={setDefaultLanguage}>
              Set Default
        </button>
        
			</div>
      

      {/* Setting */}
			<div className='flex items-center m-2'>
				<button
					className='preferenceBtn group'
				>
					<div className='h-4 w-4 text-dark-gray-6 font-bold text-lg'>
						<AiOutlineSetting />
					</div>
					<div className='preferenceBtn-tooltip'>Settings</div>
				</button>

        {/* FullScreen */}
				<button className='preferenceBtn group'>
					<div className='h-4 w-4 text-dark-gray-6 font-bold text-lg'>
						{<AiOutlineFullscreen /> }
					</div>
					<div className='preferenceBtn-tooltip'>Full Screen</div>
				</button>
			</div>
			{/* {settings.settingsModalIsOpen && <SettingsModal settings={settings} setSettings={setSettings} />} */}
		</div>
  )
}

export default PreferenceNav