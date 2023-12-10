import { AiOutlineFullscreen, AiOutlineFullscreenExit, AiOutlineSetting } from "react-icons/ai"
import PropTypes from 'prop-types'
import { useState, useEffect } from "react"
import SettingsModal from "../../Modals/SettingsModal"

PreferenceNav.propTypes = {
  handleLanguageExtension: PropTypes.func.isRequired,
  setDefaultLanguage: PropTypes.func.isRequired, 
  language: PropTypes.string.isRequired,
  isDatabase: PropTypes.bool
}

function PreferenceNav({ setSettings, settings, handleLanguageExtension, setDefaultLanguage, language, isDatabase}) {
  const [isFullScreen, setIsFullScreen] = useState(false)
  const handleFullScreen = () => {
		if (isFullScreen) {
			document.exitFullscreen()
		} else {
			document.documentElement.requestFullscreen()
		}
		setIsFullScreen(!isFullScreen)
	}
  useEffect(() => {
		function exitHandler(e) {
			if (!document.fullscreenElement) {
				setIsFullScreen(false);
				return;
			}
			setIsFullScreen(true);
		}

		if (document.addEventListener) {
			document.addEventListener("fullscreenchange", exitHandler);
			document.addEventListener("webkitfullscreenchange", exitHandler);
			document.addEventListener("mozfullscreenchange", exitHandler);
			document.addEventListener("MSFullscreenChange", exitHandler);
		}
	}, [isFullScreen])

  return (
    <div className='flex items-center justify-between bg-dark-layer-2 h-12 w-full '>
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
          {!isDatabase && (
            <>
              <option value='js'>Javascript</option>
              <option value='py'>Python 3</option>
            </>
          )}
          {isDatabase && (
            <>
              <option value='mysql'>MySQL</option>
            </>
          )}
        
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
          onClick={() => setSettings({ ...settings, settingsModalIsOpen: true })}
				>
					<div className='h-4 w-4 text-dark-gray-6 font-bold text-lg'>
						<AiOutlineSetting />
					</div>
					<div className='preferenceBtn-tooltip'>Settings</div>
				</button>

        {/* FullScreen */}
				<button className='preferenceBtn group'  onClick={handleFullScreen}>
					<div className='h-4 w-4 text-dark-gray-6 font-bold text-lg'>
            {!isFullScreen ? <AiOutlineFullscreen /> : <AiOutlineFullscreenExit />}
					</div>
					<div className='preferenceBtn-tooltip'>Full Screen</div>
				</button>
			</div>
			{settings.settingsModalIsOpen && <SettingsModal settings={settings} setSettings={setSettings} />}
		</div>
  )
}

export default PreferenceNav