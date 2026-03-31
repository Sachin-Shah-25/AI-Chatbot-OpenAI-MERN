import ChatBot from '../Components/ChatBot'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

import axios from 'axios'

function ChatPage() {
  const navigate = useNavigate()



  const getUser = async () => {
    const controller = new AbortController();
    try {
      const isUser = await axios.get("https://ai-chatbot-backend.onrender.com/me", {
        withCredentials: true,
        signal: controller.signal,
      });
      console.log(isUser)
      if (isUser.status != 200) {
        navigate("/signin")
      }
    }
    catch (err) {
      console.log(err.message)

    }
    controller.abort()

  }
  useEffect(() => {
    getUser();

  }, [])
  return <>
    <ChatBot />
  </>
}
export default ChatPage