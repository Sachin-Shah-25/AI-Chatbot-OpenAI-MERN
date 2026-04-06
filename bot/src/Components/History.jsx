import { AppProvider } from '../ContextProvider/AppContext'
import {useContext} from 'react'
function History(){
    const { setHistory } = useContext(AppProvider)
    
    return <div className="history_component" onClick={()=>setHistory("History")}>
        History
    </div>
}

export default History