import botimage from '../assets/botimage.png'
import { useEffect, useState } from 'react'
function Intro() {

    const [showIntro, setShowIntro] = useState(true);
    const [hide, setHide] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setHide(true); 
        }, 1500);

        setTimeout(() => {
            setShowIntro(false);
        }, 2500);
    }, []);
    return <>
        {showIntro && (
          
        <div className={`intro intro_container ${hide ? "hide" : ""}`} >
            <div className="intro_inside_container">
                <div className="bot_img_container">
                    <img className="bot_img" src={botimage} />
                </div>
                <div className="row_outer">
                    <div className="row_inner"></div>
                </div>
            </div>
        </div>
        )}

    </>
}

export default Intro