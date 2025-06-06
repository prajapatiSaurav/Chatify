import React from 'react'
import {Routes,Route} from "react-router"
import {Toaster} from "react-hot-toast"

import HomePage from "./pages/HomePage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import SignUpPage from "./pages/SignUpPage.jsx"
import CallPage from "./pages/CallPage.jsx"
import ChatPage from "./pages/ChatPage.jsx"
import NotificationPage from "./pages/NotificationPage.jsx"
import OnboardingPage from "./pages/OnBoardingPage.jsx"

function App() {

  const {data,isloading,error} = useQuery({
    queryKey: ["todos"],

    queryFn: async ()=>{
      const res = await fetch("");
      return data;
    }
  })
  return (
    <div className='h-screen' data-theme="night">
      <Toaster/>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/call' element={<CallPage />} />
        <Route path='/chat' element={<ChatPage />} />
        <Route path='/notification' element={<NotificationPage />} />
        <Route path='/onboarding' element={<OnboardingPage />} />

      </Routes>
      
    </div>
  )
}

export default App
