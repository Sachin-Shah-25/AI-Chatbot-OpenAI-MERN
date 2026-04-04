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
import {useLocation} from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
const DABASE_URL = import.meta.env.VITE_DABASE_URL
const controller = new AbortController();
function ChatBox() {
    const [getuserIntput, setUserInput] = useState("")
    const [botLoading, setBotLoading] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    const ref = useRef(null)
    const send = useRef(null)
    const receive = useRef(null)
    const isTyping = useDebounce(getuserIntput);
    const showLoading = getuserIntput && isTyping;
    const [askQuestion, setQuestion] = useState([{
        by: "bot",
        bot: "Hi I am bot , How can I help"
    }])
    // const prev_App = PrevApp()
    const [getConfrim, setConfrim] = useState(false)

    const userInputFun = (e) => {
        setUserInput(e.target.value)
    }
    const sendMessageFun = () => {

        setQuestion((prev) => [...prev, { by: "user", user: getuserIntput }])
        send.current?.play()
        if (botLoading) {
            return;
        }
        setBotLoading(true)
        setTimeout(async () => {
            setBotLoading(false)
            try {
                const { data } = await axios.post(`${DABASE_URL}/bot/chat`,

                    { message: getuserIntput },
                    { withCredentials: true })
                if (data.isLogged) {
                    navigate("/signin")
                }
                if (!data.success && !data.isConfirm) { // ask next queston
                    setQuestion((prev) => [...prev, { by: "bot", bot: data.next }])
                }
                else if (!data.success && data.isConfirm) { //ask detail is Ok  
                    setQuestion((prev) => [...prev, { by: "bot", bot: data.confirm }])
                }
                else if (data.success && data.isConfirm && !data.appDone) { // booked
                    setQuestion((prev) => [...prev, { by: "bot", bot: data.message }])
                }
                else if (data.success && data.isConfirm && data.appDone) {  // Final Done 
                    setQuestion((prev) => [...prev, { by: "bot", bot: `${data.message} 🙂 Appointment Id ${data.appid} If you want cancel Say "CANCEL"` }])
                }
                else if (data.success && data.isConfirm && data.intent === "cancel") {  // Final Done 
                    setQuestion((prev) => [...prev, { by: "bot", bot: data.message }])
                }
                else {
                    setQuestion((prev) => [...prev, { by: "bot", bot: "couldn't find" }])
                }


            }
            catch (err) {

                const erroCode = err.response ? err.response.status : 500

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
                        chat.by === "bot" ?
                            <BotMessage key={chat.by.at(0) + index} botrep={chat.bot} />
                            : <UserMessage key={chat.by.at(0) + index} botrep={chat.user} />

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

            <div className="chat_input" >
                <input type="text" id="chat_input_area"
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