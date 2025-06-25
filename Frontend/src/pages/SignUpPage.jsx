import React from 'react'
import { useState } from 'react'

const SignUpPage = () => {

  const [signupData , setsignupData] = useState({
    fullName: "",
    email : "",
    password:"",
  })
  
  const handleSignup = (e) =>{
    e.preventDefault();
  }

  return (
    <div className=''></div>
  )
}

export default SignUpPage
