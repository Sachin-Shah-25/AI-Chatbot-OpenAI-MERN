import { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { FaRegEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import {useNavigate} from 'react-router-dom'

function SignIn() {
  const [userData, setUserData] = useState({ useremail: "", userpassword: "" })
  const [showPass, hidePass] = useState(false)
  const [showError, setError] = useState(null)
  const navigate=useNavigate()
  const handleChange = (e) => {
    setUserData(prev => {
      return { ...prev, [e.target.name]: e.target.value }
    })
  }
  const signInFun = async (e) => {
    e.preventDefault()
    try {
      if (!userData["useremail"] || !userData["userpassword"]) {
        setError("Invalid Details")
        return;
      }
      const { data } = await axios.post("http://localhost:8000/auth/signin", userData, { withCredentials : true })

      console.log(data)
      navigate("/")

    }
    catch (err) {
      const erroCode = err.response.status||500
      if (erroCode >= 400 && erroCode < 500) {
        setError(err.response.data.message)
      }
    }
  }
  return (
    <div className="container">
      <form className="form" onSubmit={(e) => signInFun(e)}>
        {
          showError
            ? <div className="error_msg">{showError}</div>
            : ""
        }
        <h2>Sign In</h2>

        <input onFocus={() => setError(false)} onChange={e => handleChange(e)} type="text" placeholder="useremail" className="input" name="useremail" />
        <div className="input_div">
          <input onFocus={() => setError(false)} onChange={e => handleChange(e)} type={showPass ? "text" : "password"} placeholder="userpassword" name="userpassword" className="input" />
          {
            showPass
              ? <FaRegEye onClick={() => hidePass((prev) => !prev)} />
              : <FaEyeSlash onClick={() => hidePass((prev) => !prev)} />

          }
        </div>

        <button className="btn">Sign In</button>
        <Link to={"/signup"}>Sign Up</Link>
      </form>
    </div>
  );
}

export default SignIn;