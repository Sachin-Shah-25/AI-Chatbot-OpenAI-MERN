import BotImage from '../assets/botimage.png'
import ReactMarkdown from "react-markdown";
import TimeComponent from './TimeComponent';
import History from './History';
import HistoryComponent from './HistoryComponent';
import { Link } from 'react-router-dom'
import React from 'react'
function BotMessage({ time, botrep, history }) {
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
            {
                time && <div className="app_time">

                    {time.map((tm, index) => {
                        return <TimeComponent t={tm.slot} key={index} ></TimeComponent>
                    })}
                </div>
            }


            <div className="app_history">
                {
                    history ? history.map((det, ind) => {
                        return <HistoryComponent det={det} key={ind}></HistoryComponent>
                    })
                        : <History>

                        </History>
                }
            </div>

        </div>
    </>
}

export default React.memo(BotMessage)