import { useState, useCallback, useEffect, useContext } from 'react'
import Split from 'react-split'
import { useNavigate } from 'react-router'
import PropTypes from 'prop-types'
import PreferenceNav from './PreferenceNav'
import CodeMirror,{ EditorView } from '@uiw/react-codemirror'
import { vscodeDark} from '@uiw/codemirror-theme-vscode'
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python'
import EditorFooter from './EditorFooter'
import { apiAssistanceItem, apiProblemSubmission, apiProblemSubmissionItem } from '../../../api'
import { getAuthToken } from '../../../utils'
import { socket } from '../../../socket'
import { CodeContext } from '../../../context'
import { toast, Zoom } from 'react-toastify'
import MDEditor from '@uiw/react-md-editor'
import { Spinner } from 'flowbite-react'


const languageExtension = {
  js: [javascript()], 
  py: [python()]
}

Playground.propTypes = {
  problem: PropTypes.object.isRequired,
}

function Playground({ problem }) {
  const { code, setCode } = useContext(CodeContext)
  const [language, setLanguage] = useState('js')
  const [extension, setExtension] = useState([javascript({ jsx: true }), [EditorView.lineWrapping]])
  // const [code, setCode] = useState('')
  const [activeTestCaseId, setActiveTestCaseId] = useState(0)
  const [activeTab, setActiveTab] = useState('testCases')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiReview, setAiReview] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const defaultLang = localStorage.getItem('default-language') || 'js'
    setLanguage(defaultLang)
  }, [])

  const handleLanguageExtension = (language) => {
    setLanguage(language)
    setExtension(languageExtension[language], [EditorView.lineWrapping])
  }
  const setDefaultLanguage = () => {
    localStorage.setItem("default-language", language)
    console.log(`${language} set as default!`)
  };
  
  const onCodeChange = useCallback((val) => {
    console.log(val)
    setCode(val)
  }, [setCode])

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
      setAiReview(data.content)
      setAiLoading(false)
    } catch (error) {
      console.error(error)
      setAiReview(error.message)
      setAiLoading(false)
    }
  }


  const handleSubmit = async() => {
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
        console.log(submittedId)
        const pollTimeOut = setTimeout(() => {
          console.log('Timeout reached. Stopping poll.');
          clearInterval(pollInterval);
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
          return navigate(`/problems/${[problem.id]}/submission`, {state: { submissionResult: data.data}})
                  
        }, 1000)
        

      } else {
        // setOutput(retry again)
      }
    } catch (error) {
      console.error('Error submitting problem:', error)
    }
    
  console.log('aiReivew', aiReview)
    
  }
  return (
    <div className='flex flex-col bg-dark-layer-1 relative overflow-x-hidden overflow-hidden'>
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
        <div className='w-full px-5 pb-[52px] overflow-auto'>
          {/* testCase heading */}
          <div className='flex h-10 items-center space-x-6'>
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
          { activeTab === 'testCases' && (
            <>
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
           </>
            
          )}
          {activeTab === 'codeReview' && aiReview !== null && !aiLoading &&(
            <div className='p-2 text-sm'>
              <MDEditor.Markdown 
                source={aiReview}
                className="bg-transparent text-sm text-white" />
            </div>
          )}

          {activeTab === 'codeReview' && aiReview === null && aiLoading &&(
            <div className='flex items-center justify-center p-2 text-sm h-full pb-[26px]'>
              <Spinner color="gray" size="xl"/>
              
            </div>
          )}

          {activeTab === 'codeReview' && aiReview === null && (
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
         
        </div>
      </Split>
      <EditorFooter handleSubmit={ handleSubmit } code={ code }/>
      
    </div>
  )
}

export default Playground