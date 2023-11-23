import './App.css'
import Problems from './pages/Problems';
import Problem from './pages/Problem';
import { Routes, Route } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import Auth from './pages/Auth';



function App() {
  return (
    <>
    <RecoilRoot>
      <Routes>
        <Route path='problems' element={<Problems />}/>
        <Route path='problems/:problemId/*' element={<Problem />}/>
        <Route path='auth' element={< Auth/>}/>
      </Routes>
    
    </RecoilRoot>
    </>
  )
}


export default App