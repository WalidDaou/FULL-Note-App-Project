import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useCommerceStore } from '../store'

import "./Register.css"

interface LoginProps {
  email: string,
  password: string,
  name : string
}

const Login: React.FC<LoginProps> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setToken, setDecodedToken } = useCommerceStore()
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    const requestBody = {

      email: email,
      password: password
    }


    const response = await fetch('http://localhost:5000/api/Login', {
      method: 'POST',
      // needed so that the backend knows that the request has JSON
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    if (response.ok) {
      // Registration successful, handle the redirect here
      const data = await response.json()
      setToken(data.yap)
      const decodedToken = data.decodedToken;
      setDecodedToken(decodedToken)
      console.log(decodedToken.name)
      alert(decodedToken.name)

      window.location.href = '#notes';
    } else {
      console.log('wronge in login ');


      // Check if the user already exists



      // Implement registration logic here (e.g., send data to backend)

    };



  }

  return (
    <>
      <form action="">
        <div className='RegisterForm'>
          <div className='RegisterForme'>

            <span className="flex">
              <label htmlFor="email">Email</label>
              <input type="text" name="email" id="email" onChange={(e) => { setEmail(e.target.value) }} value={email} />
            </span>

            <span className="flex">
              <label htmlFor="password">password</label>
              <input type="text" name="password" id="password" onChange={(e) => { setPassword(e.target.value) }} value={password} />
            </span>
          </div>

          <button className='LinkReg' type="button" onClick={handleLogin}>     Login   </button>
          <Link to='/register' className='' >new here ,sign up </Link>
        </div>
      </form>

    </>
  )
}




export default Login