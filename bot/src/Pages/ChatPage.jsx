import ChatBot from '../Components/ChatBot'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
const DABASE_URL = import.meta.env.VITE_DABASE_URL

import axios from 'axios'

function ChatPage() {
  const navigate = useNavigate()



 useEffect(() => {
   
    
    const checkUser = async () => {
        try {
            const isUser = await axios.get(`${DABASE_URL}/me`, {
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
