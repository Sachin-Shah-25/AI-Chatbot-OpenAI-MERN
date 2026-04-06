// import ChatPage from './Pages/ChatPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import React, { Suspense } from 'react'
// import SignUp from './Components/SignUp'
// import SignIn from './Components/SignIn'
import Intro from './Components/Intro'
import { useEffect, useState } from 'react'
import Loading from './Components/Loading'

const ChatPage = React.lazy(() => import("./Pages/ChatPage"))
const SignUp = React.lazy(() => import("./Components/SignUp"))
const SignIn = React.lazy(() => import("./Components/SignIn"))

function App() {
  const [showIntro, setShowIntro] = useState(true);


  useEffect(() => {

    setTimeout(() => {
      setShowIntro(false);
    }, 1000);
  }, []);


  if (showIntro) return <Intro />;
  return <>
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<ChatPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </>
}

export default App