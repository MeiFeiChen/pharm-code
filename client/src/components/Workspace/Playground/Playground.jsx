import { useState, useCallback, useEffect } from 'react'
import Split from 'react-split'
import { useNavigate } from 'react-router'
import PropTypes from 'prop-types'
import PreferenceNav from './PreferenceNav'
import CodeMirror from '@uiw/react-codemirror'
import { vscodeDark} from '@uiw/codemirror-theme-vscode'
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python'
import EditorFooter from './EditorFooter'
import { apiProblemSubmission, apiProblemSubmissionItem } from '../../../api'
import { getAuthToken } from '../../../utils'

const languageExtension = {
  js: [javascript()], 
  py: [python()]
}

Playground.propTypes = {
  problem: PropTypes.object.isRequired,
}

function Playground({ problem }) {
  const [language, setLanguage] = useState('js')
  const [extension, setExtension] = useState([javascript({ jsx: true })])
  const [code, setCode] = useState('')
  const [activeTestCaseId, setActiveTestCaseId] = useState(0)

  const navigate = useNavigate()

  useEffect(() => {
    const defaultLang = localStorage.getItem('default-language') || 'js'
    setLanguage(defaultLang)
  }, [])

  const handleLanguageExtension = (language) => {
    setLanguage(language)
    setExtension(languageExtension[language])
  }
  const setDefaultLanguage = () => {
    localStorage.setItem("default-language", language)
    console.log(`${language} set as default!`)
  };
  
  const onCodeChange = useCallback((val) => {
    console.log(val)
    setCode(val)
  }, [setCode])


  const handleSubmit = async() => {
    const payload = {
      language, 
      code
    }
    const token = getAuthToken()
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    }
    try {
      const { data } = await apiProblemSubmission(problem.id, payload, config)
      const submittedId = data.submittedId
      console.log('data', data)
    
      if (submittedId) {
        console.log(submittedId)

    
        // Poll
        const pollInterval = setInterval(async () => {
          console.log(problem.id, submittedId);
    
          const { data, errors } = await apiProblemSubmissionItem(problem.id, submittedId, config)
          console.log('response', data)

          if (errors) {
            clearInterval(pollInterval)
          }
          
          if (data.data.status === 'pending'){
            console.log('pending')
            return 
          } 
          clearInterval(pollInterval)
          clearTimeout(pollTimeOut)

          
          return navigate(`/problems/${[problem.id]}/submission`, {state: { submissionResult: data.data}})
                  
        }, 1000)
        
        const pollTimeOut = setTimeout(() => {
          console.log('Timeout reached. Stopping poll.');
          clearInterval(pollInterval);
        }, 15000); 

      } else {
        // setOutput(retry again)
      }
    } catch (error) {
      console.error('Error submitting problem:', error);
    }
    
    
  }
  return (
    <div className='flex flex-col bg-dark-layer-1 relative overflow-x-hidden'>
      <PreferenceNav 
        handleLanguageExtension={handleLanguageExtension}
        setDefaultLanguage={setDefaultLanguage}
        language={language}/>
      <Split className='h-[calc(100vh-94px)]' direction='vertical' sizes={[60, 40]} minSize={60}>
        <div className='w-full overflow-auto'>
        <CodeMirror
						value={code}
						theme={vscodeDark}
						extensions={extension}
						style={{fontSize:16}}
            onChange={onCodeChange}
					/>
        </div>
        <div className='w-full px-5 overflow-auto'>
          {/* testCase heading */}
          <div className='flex h-10 items-center space-x-6'>
						<div className='relative flex h-full flex-col justify-center cursor-pointer'>
							<div className='text-sm font-medium leading-5 text-white'>Test cases</div>
							<hr className='absolute bottom-0 h-0.5 w-full rounded-full border-none bg-white' />
						</div>
					</div>
          <div className='flex'>
						{problem.exampleCases?.map((example, index) => (
							<div
								className='mr-2 items-start mt-2 '
								key={index}
								onClick={() => setActiveTestCaseId(index)}
							>
								<div className='flex flex-wrap items-center gap-y-4'>
									<div
										className={`font-medium items-center transition-all focus:outline-none inline-flex bg-dark-fill-3 hover:bg-dark-fill-2 relative rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap
										${activeTestCaseId === index ? "text-white" : "text-gray-500"}
									`}
									>
										Case {index + 1}
									</div>
								</div>
							</div>
						))}
					</div>
          <div className='font-semibold my-4'>
						<p className='text-sm font-medium mt-4 text-white'>Input:</p>
						<div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2'>
							{problem.exampleCases && problem.exampleCases[activeTestCaseId].test_input}
						</div>
						<p className='text-sm font-medium mt-4 text-white'>Output:</p>
						<div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2'>
							{problem.exampleCases && problem.exampleCases[activeTestCaseId].expected_output}
						</div>
					</div>
        </div>
      </Split>
      <EditorFooter handleSubmit={ handleSubmit }/>
    </div>
  )
}

export default Playground