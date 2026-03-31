import BotImage from '../assets/botimage.png'
import ReactMarkdown from "react-markdown";
function BotMessage({ botrep }) {
    return <>
        <div className="bot_msg_container">
            <div className="bot_image">
                <img src={BotImage} />
            </div>
            <div className="bot_msg">
                <h5>
                    <ReactMarkdown>
                        {botrep}
                    </ReactMarkdown>
                </h5>
            </div>
        </div>
    </>
}

export default BotMessage