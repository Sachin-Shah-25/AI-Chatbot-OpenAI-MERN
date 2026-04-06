import { createContext ,useState} from 'react'


export const AppProvider = createContext();




const ContextProvider = ({ children }) => {
    const [getCurrentTime,setCurrentTime]=useState(null)
    const [getHistory,setHistory]=useState(null)
    return <AppProvider.Provider value={{
        getCurrentTime,
        setCurrentTime,
        getHistory,
        setHistory
        
        }}>
        {children}
    </AppProvider.Provider>
}
export default ContextProvider;