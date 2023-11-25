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




function App() {
  const [isLogin, setIsLogin] = useState(false)
  const [userProfile, setUserProfile] = useState({})


  useEffect(() => {
    const fetchData = async (config) => {
      try {
        const { data } = await apiUserProfile(config)
        setUserProfile(data.data)
        setIsLogin(true)
      } catch (err) {
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
        {/* <Route path='auth' element={< Auth/>}/> */}
        
      </Routes>
      <Auth />
    
    
    </RecoilRoot>
    </AuthContext.Provider>
  )
}


export default App