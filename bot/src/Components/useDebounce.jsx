import {useState,useEffect} from 'react'
function useDebounce(key_Press){
    const [getState,setState]=useState(true)
    useEffect(()=>{
        
    const id=setTimeout(()=>{
         if (!key_Press) return;
        setState(true);
        setState(false)
    },1000)

     return () => clearTimeout(id);
    },[key_Press])

    return getState
}
export default useDebounce