import { useState, useCallback, useEffect, useContext } from 'react'
import Split from 'react-split'
import { useNavigate } from 'react-router'
import PropTypes from 'prop-types'
import PreferenceNav from './PreferenceNav'
import CodeMirror,{ EditorView } from '@uiw/react-codemirror'
import { vscodeDark} from '@uiw/codemirror-theme-vscode'
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python'
import { sql } from '@codemirror/lang-sql'
import EditorFooter from './EditorFooter'
import { apiAssistanceItem, apiProblemSubmission, apiProblemSubmissionItem } from '../../../api'
import { getAuthToken } from '../../../utils'
import { socket } from '../../../socket'
import { runTestSocket } from '../../../socket'
import { CodeContext, AuthContext } from '../../../context'
import { toast, Zoom } from 'react-toastify'
import AlgorithmTestCases from './TestCases/AlgorithmTestCases'
import CodeReview from './CodeReview'
import AlgorithmTestCasesResult from './TestCases/AlgorithmTestCasesResult'
import { Link } from 'react-router-dom'
import { useSetRecoilState } from "recoil"
import { authModalState } from "../../../atoms/authModalAtom"
import DatabaseTestCases from './TestCases/DatabaseTestCases'
import DatabaseTestCasesResult from './TestCases/DatabaseTestCasesResult'
import useLocalStorage from '../../../hooks/useLocalStorage'


const languageExtension = {
  js: [javascript({ jsx: true }), [EditorView.lineWrapping]], 
  py: [python(), [EditorView.lineWrapping]],
  mysql: [sql()]
}

Playground.propTypes = {
  problem: PropTypes.object.isRequired,
}

function Playground({ problem }) {
  const { isLogin } = useContext(AuthContext)
  const setAuthModalState = useSetRecoilState(authModalState)
  const { code, setCode } = useContext(CodeContext)
  const [language, setLanguage] = useState('js')
  const [activeTab, setActiveTab] = useState('testCases')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiReview, setAiReview] = useState(null)
  const [testResult, setTestResult] = useState(null)
  const [testLoading, setTestIsLoading] = useState(false)
  const [disabledButton, setDisabledButton] = useState(false)
  const [fontSize, setFontSize] = useLocalStorage("lcc-fontSize", "16px")

  const [isExpanded, setIsExpanded] = useState(false);
  const [originalHeight, setOriginalHeight] = useState(null)  
  
  const [settings, setSettings] = useState({
		fontSize: fontSize,
		settingsModalIsOpen: false,
		dropdownIsOpen: false,
	});
  
  const navigate = useNavigate()

  // adjust the height of bottom region
  const handleToggleHeight = () => {
    setIsExpanded(!isExpanded)
  }
  const codingRegionHeight = isExpanded ? 95 : (originalHeight !== null ? originalHeight : 60)


  // Auth
  const handleClick = (type) => {
    setAuthModalState((prev) => ({ ...prev, isOpen: true, type }))
  }

  // set default language
  useEffect(() => {
    if (!problem.database) {
      const defaultLang = localStorage.getItem('default-algo-language') || 'js'
      setLanguage(defaultLang)
    } else {
      const defaultLang = localStorage.getItem('default-data-language') || 'mysql'
      setLanguage(defaultLang)
    }
  }, [problem.database])

  // select language
  const handleLanguageExtension = (language) => {
    setLanguage(language)
  }
  // set default language
  const setDefaultLanguage = () => {
    if (!problem.database) {
      localStorage.setItem("default-algo-language", language)
    } else {
      localStorage.setItem("default-data-language", language)
    }
    console.log(`${language} set as default!`)
  }
  
  // track code change
  const onCodeChange = useCallback((val) => {
    setCode(val)
  }, [setCode])

  // ai review
  const handleAiReview = async() => {
    const requestBody = { problemId: problem.id, language, code }
    const token = getAuthToken()
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    }
    try {
      setAiLoading(true)
      const { data } = await apiAssistanceItem(requestBody)
      console.log(data)
      setActiveTab('codeReview')
      setAiReview(data.content)
      setAiLoading(false)
    } catch (error) {
      console.error(error)
      setAiReview(error.message)
      setActiveTab('codeReview')
      setAiLoading(false)
    }
  }
  const handleTestSubmit = () => {
    runTestSocket.emit('test_data', { problemId: problem.id, language, code })
    setTestIsLoading(true)
    setDisabledButton(true)
    
    runTestSocket.on('result', (result) => {
      console.log(result)
      setActiveTab('result')
      setTestIsLoading(false)
      setDisabledButton(false)
      setTestResult(result)
      runTestSocket.off('result')
    })
  }

  // submit code
  const handleSubmit = async() => {
    setDisabledButton(true)

    const requestBody = { language, code }
    const token = getAuthToken()
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    }
    try {
      const { data } = await apiProblemSubmission(problem.id, requestBody, config)
      const submittedId = data.submittedId
      console.log('data', data)
    
      if ( submittedId ) {
        const pollTimeOut = setTimeout(() => {
          console.log('Timeout reached. Stopping poll.');
          clearInterval(pollInterval)
          toast.update(id, { 
            render: "Network error. Please try again later", 
            type: "error", 
            isLoading: false, 
            autoClose: 1000,
            theme: 'dark',
            hideProgressBar: true,
            closeOnClick: true,
            draggable: true
            })
        }, 15000)
        const id = toast.loading("Please wait...", {
          draggable: true,
          transition: Zoom
        })
    
        // Poll
        const pollInterval = setInterval(async () => {
          console.log(problem.id, submittedId);
    
          const { data, errors } = await apiProblemSubmissionItem(problem.id, submittedId, config)
          console.log('response', data)

          if (errors) {
            clearInterval(pollInterval)
            toast.update(id, { 
              render: "Error", 
              type: "error", 
              isLoading: false, 
              autoClose: 1000,
              theme: 'dark',
              hideProgressBar: true,
              closeOnClick: true,
              draggable: true
              })
          }
          
          if (data.data.status === 'pending'){
            console.log('pending')
            return 
          } 
          clearInterval(pollInterval)
          clearTimeout(pollTimeOut)
          toast.update(id, { 
            render: "Success", 
            type: "success", 
            isLoading: false, 
            autoClose: 1000,
            theme: 'dark',
            hideProgressBar: true,
            closeOnClick: true,
            draggable: true
            })
            setCode('')
            setDisabledButton(false)
          return navigate(`/problems/${[problem.id]}/submission`, {state: { submissionResult: data.data}})
                  
        }, 1000)
        
        

      } else {
        // setOutput(retry again)
      }
    } catch (error) {
      console.error('Error submitting problem:', error)
      setDisabledButton(false)
    } 
    
  }
  return (
    <div className='flex flex-col bg-dark-layer-1 relative overflow-x-hidden overflow-hidden'>
      <PreferenceNav 
        settings={settings} 
        setSettings={setSettings} 
        isDatabase={problem.database}
        handleLanguageExtension={handleLanguageExtension}
        setDefaultLanguage={setDefaultLanguage}
        language={language}/>
      <Split 
        className='h-[calc(100vh-98px)]' 
        direction='vertical' 
        sizes={[codingRegionHeight, 100-codingRegionHeight]} 
        minSize={60}
      >
        {/* Coding Region */}
        <div className='flex flex-col h-full w-full overflow-auto'>
          { !isLogin && (
            <div className='text-sm text-white p-2' style={{backgroundColor: '#0a84ff2e'}}>
              <Link className='text-blue-500 hover:underline' onClick={() => handleClick('login')}>Register / Sign in</Link> to run or submit or code review
            </div>
          )}
          <CodeMirror
              value={code}
              theme={vscodeDark}
              extensions={[languageExtension[language]]}
              style={{fontSize: settings.fontSize}}
              onChange={onCodeChange}
            />
      
        </div>
        <div className='w-full pl-5'>
          {/* heading */}
          <div className='flex h-8 items-center space-x-6'>
						<div className='relative flex h-full flex-col justify-center cursor-pointer'>
							<div 
                className={`text-sm font-medium leading-5 ${activeTab === 'testCases' ? 'text-white' : 'text-gray-500'} `}
                onClick={() => setActiveTab('testCases')}>Test cases
              </div>
							{ activeTab === 'testCases' && (
                <hr 
                  className='absolute bottom-0 h-0.5 w-full rounded-full border-none bg-white'
                />
              )}
						</div>
            <div className='relative flex h-full flex-col justify-center cursor-pointer'>
							<div 
                className={`text-sm font-medium leading-5 ${activeTab === 'result' ? 'text-white' : 'text-gray-500'} `}
                onClick={() => setActiveTab('result')}>Result
              </div>
							{ activeTab === 'result' && (
                <hr 
                  className='absolute bottom-0 h-0.5 w-full rounded-full border-none bg-white'
                />
              )}
						</div>
            <div className='relative flex h-full flex-col justify-center cursor-pointer'>
							<div 
                className={`text-sm font-medium leading-5 ${activeTab === 'codeReview' ? 'text-white' : 'text-gray-500'} `}
                onClick={() => setActiveTab('codeReview')}>Code Review
              </div>
							{ activeTab === 'codeReview' && (
                <hr 
                  className='absolute bottom-0 h-0.5 w-full rounded-full border-none bg-white'
                />
              )}
						</div>
					</div>
          {/* Button Region */}
          <div className='h-full px-5 overflow-auto pb-[80px]' >
          {/* test cases */}
          { activeTab === 'testCases' && !problem.database && (
            <AlgorithmTestCases testCases={ problem.exampleCases }/>
          )}
          { activeTab === 'testCases' && problem.database && (
            <DatabaseTestCases testCases={ problem.exampleCases }/>
          )}
          { activeTab === 'result' && !problem.database && (
            <AlgorithmTestCasesResult testResult={ testResult } testLoading={ testLoading } />
          )}
          { activeTab === 'result' && problem.database && (
            <DatabaseTestCasesResult testResult={ testResult } testLoading={ testLoading } />
          )}
          {/* AI review */}
          {activeTab === 'codeReview' && (
            <CodeReview 
              handleAiReview={ handleAiReview }
              aiReview={ aiReview }
              aiLoading={ aiLoading }
            />
          )}
          </div>
         
        </div>
      </Split>
      <EditorFooter 
        isExpanded={isExpanded}
        handleToggleHeight={ handleToggleHeight }
        handleSubmit={ handleSubmit } 
        handleTestSubmit={ handleTestSubmit }
        disabledButton = { disabledButton }
        code={ code }/>
    </div>
  )
}

export default Playground