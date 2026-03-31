import {useState,useEffect} from 'react'
import axios from 'axios'
function PrevApp(){
const [prevApp,setPrevApp]=useState("hi")



useEffect(()=>{
    // const {data}=await axios.get("http://localhost:8000/app/prev",{withCrendentials:true});
    // console.log(data)
    // setPrevApp(data)
},[])
    return prevApp
}

export default PrevApp