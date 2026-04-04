import { useState,useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { FaRegEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import {useNavigate,useLocation} from 'react-router-dom'
const DABASE_URL = import.meta.env.VITE_DABASE_URL

function SignIn() {
  const [userData, setUserData] = useState({ useremail: "", userpassword: "" })
  const [showPass, hidePass] = useState(false)
  const [showError, setError] = useState(null)
  const [loading,setLoading]=useState(false)
  const msg=useLocation()
  const navigate=useNavigate()
  const handleChange = (e) => {
    setUserData(prev => {
      return { ...prev, [e.target.name]: e.target.value }
    })
  }
  const signInFun =  (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(async()=>{
      setLoading(false)
      try {
        if (!userData["useremail"] || !userData["userpassword"]) {
          setError("Invalid Details")
          return;
        }
        const { data } = await axios.post(`${DABASE_URL}/auth/signin`, userData, { withCredentials : true })
  
        navigate("/", { state: { message: true } })
  
      }
      catch (err) {
        const erroCode = err.response.status||500
        if (erroCode >= 400 && erroCode < 500) {
          setError(err.response.data.message)
        }
      }
    },2000)
  }

  useEffect(()=>{

    if(showError && showError.includes("Created!")) {
      return
    }
      setError(msg.state?.message)
      
  },[msg.state])
  return (
    <div className="container" >
      <form className="form" onSubmit={(e) => signInFun(e)} style={{backgroundColor:loading && "f3f3f3",opacity: loading && "0.5"}} >
        {
          showError
            ? <div style={{color:showError.includes("Created!")?"green":"red"}} className="error_msg">{showError}</div>
            : ""
        }
        <h2>Sign In</h2>

        <input  readOnly={loading && loading} onFocus={() => setError(false)} onChange={e => handleChange(e)} type="text" placeholder="useremail" className="input" name="useremail" />
        <div className="input_div">
          <input readOnly={loading  && loading}  onFocus={() => setError(false)} onChange={e => handleChange(e)} type={showPass ? "text" : "password"} placeholder="userpassword" name="userpassword" className="input" />
          {
            showPass
              ? <FaRegEye onClick={() => hidePass((prev) => !prev)} />
              : <FaEyeSlash onClick={() => hidePass((prev) => !prev)} />

          }
        </div>

        <button disabled={loading && loading} style={{cursor:loading && "not-allowed"}} className="btn">Sign In</button>
        <Link to={"/signup"}>Sign Up</Link>
      </form>
    </div>
  );
}

export default SignIn;