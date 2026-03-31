import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// import Loader from './Components/Loading'
// import BotMessage from './Components/BotMessage'
// import UserMessage from './Components/UserMessage'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
