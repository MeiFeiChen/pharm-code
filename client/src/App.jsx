import './App.css'
import { useState, useCallback, useEffect } from 'react';
import moment from 'moment'
import axios from 'axios';
import CodeMirror from '@uiw/react-codemirror'
import { dracula } from '@uiw/codemirror-theme-dracula'
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python'
import stubs from './stubs';



function App() {
  const [code, setCode] = useState("console.log('hi!');");
  const [language, setLanguage] = useState("js")
  const [extension, setExtension] = useState([javascript({ jsx: true })])


  const [output, setOutput] = useState('')
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);

  useEffect(() => {
    setCode(stubs[language]);
  }, [language]);

  useEffect(() => {
    const defaultLang = localStorage.getItem("default-language") || "js"
    setLanguage(defaultLang)
  }, [])

  let pollInterval

  const submitCode = async() => {
    const payload = {
      language, 
      code
    }
    console.log(code)
    try {
      setOutput("")
      setStatus(null)
      setJobId(null)
      setJobDetails(null)

      const { data } = await axios.post('http://localhost:3000/run', payload)

      if (data.jobId) {
        setJobId(data.jobId)
        setStatus("Submitted.")

        // poll
        pollInterval = setInterval(async() => {
        const {data: statusRes} = await axios.get('http://localhost:3000/status', 
          {params: { id: data.jobId }})
          const {success, job, error} = statusRes

          console.log(statusRes)
          if (success) {
            const {status: jobStatus, output: jobOutput} = job
            console.log('status', jobStatus)
            setStatus(jobStatus)
            setJobDetails(job)

            if (jobStatus === "pending") return
            setOutput(jobOutput)
            clearInterval(pollInterval)
            
          } else {
            console.error(error)
            setStatus("Bad request");
            setOutput(error)
            clearInterval(pollInterval)
          }
        }, 1000)
      } else {
        setOutput("Retry again.")
      }
    } catch ({response}) {
      if (response) {
        const errMsg = response.data.err.stderr
        setOutput(errMsg)
      } else {
        setOutput("Please retry submitting.")
      }
    }
  }

  const setDefaultLanguage = () => {
    localStorage.setItem("default-language", language);
    console.log(`${language} set as default!`);
  };

  const renderTimeDetails = () => {
    if (!jobDetails) {
      return ""
    }
    let { submittedAt, startedAt, completedAt } = jobDetails;
    let result = ""
    submittedAt = moment(submittedAt).toString()
    result += `Job Submitted At: ${submittedAt}  `
    if (!startedAt || !completedAt) return result

    const start = moment(startedAt)
    const end = moment(completedAt)
    const diff = end.diff(start, "seconds", true)
    result += `Execution Time: ${diff}s`
    return result
  }

  const onChange = useCallback((val) => {
    console.log(val)
    setCode(val)
  }, [])

  return (
    <div className='App'>
      <h2>Online Code Compiler</h2>
      <div>
        <label>Language: </label>

        {/* 設定為預設語言 */}
        <div>
          <button 
            onClick={setDefaultLanguage}>
              Set Default
          </button>
        </div>
        {/* 選擇語言 */}
        <select
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value)
            setExtension([python()])
            console.log(e.target.value)
          }}
        >
          <label>Language: </label>
          <option value='js'>Javascript</option>
          <option value='py'>Python</option>
        </select>
      </div>
      <br />

      {/* Compiler */}
      <header className='App-header'>
        
        <div className='top-20 bottom-40 left-10 right-10 text-left'>
          <CodeMirror 
            value={code} 
            theme={dracula}
            extensions={extension} 
            onChange={onChange} />

          <div className='border-2 bg-green-500' onClick={submitCode}>Submit</div>
          <p>{status}</p>
          <p>{jobId && `JobID: ${jobId}`}</p>
          <p>{output}</p>
          <p>{renderTimeDetails()}</p>
        </div>
      </header>
       
    </div>
  )
}


export default App