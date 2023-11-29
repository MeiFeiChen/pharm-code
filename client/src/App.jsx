import './App.css'
import { useEffect, useState } from 'react'
import Problems from './pages/Problems'
import Problem from './pages/Problem'
import { Routes, Route } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import Auth from './pages/Auth'
import { AuthContext } from './context'
import { getAuthToken } from './utils'
import { apiUserProfile } from './api'
import Chat from './components/Modals/ChatBot/ChatBot'
import { ToastContainer } from 'react-toastify'


function App() {
  const [isLogin, setIsLogin] = useState(false)
  const [userProfile, setUserProfile] = useState(null)



  useEffect(() => {
    const fetchData = async (config) => {
      try {
        const { data } = await apiUserProfile(config)
        setUserProfile(data.data)
        setIsLogin(true)
      } catch (err) {
        setUserProfile(null)
        setIsLogin(false)
        console.error('error fetching user submission data', err)
      }
    }
    const token = getAuthToken()

    if (token) {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      }
      fetchData(config);
    }
  }, [isLogin])



  return (
    <AuthContext.Provider value={{isLogin, setIsLogin, userProfile, setUserProfile}}>
    <RecoilRoot>
      <Routes>
        <Route path='problems' element={<Problems />}/>
        <Route path='problems/:problemId/*' element={<Problem />}/>
        <Route path='chat' element={<Chat />} /> 
        
      </Routes>
      <Auth />
      <ToastContainer 
        position="top-center"/>
      
      
    
    
    </RecoilRoot>
    </AuthContext.Provider>
  )
}


export default App