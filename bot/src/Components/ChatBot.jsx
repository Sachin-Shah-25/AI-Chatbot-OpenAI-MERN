import BotMessage from '../Components/BotMessage'
import UserMessage from '../Components/UserMessage'
import Loading from '../Components/Loading'
import useDebounce from '../Components/useDebounce'
import CancelAppointment from '../Components/CancelAppointment'
import BookAppointment from '../Components/BookAppointment'
import About from '../Components/About'
import PrevApp from '../Components/PrevApp'
import receiveaudio from '../assets/receive.wav'
import sendaudio from '../assets/send.mp3'
import axios from 'axios'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
const controller = new AbortController();
function ChatBox() {
    const [getuserIntput, setUserInput] = useState("")
    const [botLoading, setBotLoading] = useState(false)
    const navigate = useNavigate()
    const ref = useRef(null)
    const send = useRef(null)
    const receive = useRef(null)
    const isTyping = useDebounce(getuserIntput);
    const showLoading = getuserIntput && isTyping;
    const [askQuestion, setQuestion] = useState([{ bot: "Hi I am bot , How can I help" }])
    // const prev_App = PrevApp()
    const [getConfrim, setConfrim] = useState(false)

    const userInputFun = (e) => {
        setUserInput(e.target.value)
    }
    const sendMessageFun = () => {

        setQuestion((prev) => [...prev, { user: getuserIntput }])
        send.current?.play()
        setBotLoading(true)
        setTimeout(async () => {
            setBotLoading(false)
            try {
                console.log(getuserIntput)
                const { data } = await axios.post("https://ai-chatbot-backend.onrender.com/bot/chat",

                    { message: getuserIntput },
                    { withCredentials: true })
                console.log(data)
                if (data.isLogged) {
                    navigate("/signin")
                }
                if (!data.success && !data.isConfirm) { // ask next queston
                    setQuestion((prev) => [...prev, { bot: data.next }])
                }
                else if (!data.success && data.isConfirm) { //ask detail is Ok  
                    setQuestion((prev) => [...prev, { bot: data.confirm }])
                }
                else if (data.success && data.isConfirm && !data.appDone) { // booked
                    setQuestion((prev) => [...prev, { bot: data.message }])
                }
                else if (data.success && data.isConfirm && data.appDone) {  // Final Done 
                    setQuestion((prev) => [...prev, { bot: `${data.message} 🙂 Appointment Id ${data.appid} If you want cancel Say "CANCEL"` }])
                }
                else if (data.success && data.isConfirm && data.intent === "cancel") {  // Final Done 
                    setQuestion((prev) => [...prev, { bot: data.message }])
                }
                else {
                    setQuestion((prev) => [...prev, { bot: "couldn't find" }])
                }


            }
            catch (err) {

                const erroCode = err.response ? err.response.status : 500

                // console.log(err.response.data.message)
                if (erroCode >= 400 && erroCode < 500) {
                    setQuestion((prev) => [...prev, { bot: err.response ? err.response.data.message : "Interval Server Error" }])
                    // setQuestion()
                }
            }
            receive.current?.play()
        }, 2000);
        setUserInput("")


    }

    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
    }, [askQuestion])

    return <>
        <div className="chatbox">
            <audio ref={send} src={sendaudio} style={{ visibility: "hidden", position: "absolute" }} />
            <audio ref={receive} src={receiveaudio} style={{ visibility: "hidden", position: "absolute" }} />

            <div className="chat_header">
                🤖 ChatBot
            </div>
            <div className="chat_messages" >
                {
                    askQuestion.map((chat, index) => (

                        index % 2 == 0 ?
                            <BotMessage botrep={chat.bot} />
                            : <UserMessage botrep={chat.user} />

                    ))
                }
                {/* <CancelAppointment />,
                <BookAppointment />,
                <About /> */}
                {
                    showLoading
                        ? <Loading dir={"flex-end"} />
                        : ""
                }
                {
                    botLoading
                        ? <Loading dir={"flex-start"} />
                        : ""
                }

                <div ref={ref}></div>

            </div>

            <div className="chat_input">
                <input type="text"
                    value={getuserIntput}
                    onChange={(e) => { userInputFun(e) }}
                    placeholder="Type a message..."
                />
                <button onClick={() => sendMessageFun()} >Send</button>
            </div>

        </div>

    </>
}
export default ChatBox