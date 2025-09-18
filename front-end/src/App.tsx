import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="login-page">
    <h1>Welcome to HealthCheck Pro!</h1>
    <h2>Login Page</h2>
    <div className="login-container">
      <input type="text" placeholder="Username" className="login-input" />
      <input type="password" placeholder="Password" className="login-input" />
      <button className="login-button gmail">Sign in with Gmail</button>
      <button className="login-button icloud">Sign in with iCloud</button>
    </div>
  </div>
)
}



export default App
