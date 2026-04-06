import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ContextProvider from './ContextProvider/AppContext'
// import Loader from './Components/Loading'
// import BotMessage from './Components/BotMessage'
// import UserMessage from './Components/UserMessage'


createRoot(document.getElementById('root')).render(
<ContextProvider>
  <StrictMode>
    <App />
  </StrictMode>
  </ContextProvider>
)
