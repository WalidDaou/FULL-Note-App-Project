import { Link } from 'react-router-dom'
import React from 'react';
import './welcome.css'

const Welcome: React.FC = () => {
  return (

    <>
      <div className="welcome">

        <div className='wel'>
          <h2>Welcome</h2>
        </div>
        <div className='welink'>
          <ul>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>

          </ul>
        </div>
        </div>
      </>
      )
}




      export default Welcome;
