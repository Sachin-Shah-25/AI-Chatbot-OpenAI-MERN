import ChatBot from '../Components/ChatBot'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

import axios from 'axios'

function ChatPage() {
  const navigate = useNavigate()



 useEffect(() => {
   
    
    const checkUser = async () => {
        try {
            const isUser = await axios.get("https://ai-chatbot-openai-mern.onrender.com/me", {
                withCredentials: true
               
            });
            
            if (isUser.status !== 200) {
                navigate("/signin")
            }
        }
        catch (err) {
             if (err.name === "CanceledError") return 
            console.log(err.message)
            navigate("/signin")
        }
    }
    
    checkUser()
   
}, [])
  return <>
    <ChatBot />
  </>
}
export default ChatPage
