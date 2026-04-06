import { useContext,useEffect } from 'react'
import { AppProvider } from '../ContextProvider/AppContext'
function TimeComponent({ t }) {
    const { setCurrentTime } = useContext(AppProvider)


    // useEffect(()=>{
    //     setTime(t)
    // },[t])
    return <div className="time_component" onClick={()=>setCurrentTime(t)}>
        {t}
    </div>
}
export default TimeComponent