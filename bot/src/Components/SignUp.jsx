import { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { FaRegEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

function SignUp() {
    const [userData, setUserData] = useState({ username: "", useremail: "", userpassword: "" })
    const [showPass, hidePass] = useState(false)
    const [showError, setError] = useState(null)


    const handleChange = (e) => {
        setUserData(prev => {
            return { ...prev, [e.target.name]: (e.target.value).trim() }
        })
    }
    const signUpFun = async (e) => {
        e.preventDefault()
        try {
            console.log(userData)
            if (!userData["username"] || !userData["userpassword"] || !userData["useremail"]) {
                 setError("Invalid Details")
                return;
            }
            if (userData["userpassword"].length <= 6) {
               setError("Password too short")
                return;
            }
            const { data } = await axios.post("https://ai-chatbot-backend.onrender.com/auth/signup", userData, { withCrendential: true })

            console.log(data)

        }
        catch (e) {
            const erroCode = err.response.status
            console.log(err.response.data.message)
            if (erroCode >= 400 && erroCode < 500) {
                setError(err.response.data.message)
            }
        }
    }
    return (
        <div className="container">
            <form className="form" onSubmit={(e) => signUpFun(e)}>
                  {
          showError
            ? <div className="error_msg">{showError}</div>
            : ""
        }
                <h2>Sign Up</h2>
                <input onFocus={() => setError(false)} onChange={e => handleChange(e)} type="text" placeholder="username" className="input" name="username" />
                <input onFocus={() => setError(false)} onChange={e => handleChange(e)} type="email" placeholder="useremail" className="input" name="useremail" />
                <div className="input_div">
                    <input onFocus={() => setError(false)} onChange={e => handleChange(e)} type={showPass ? "text" : "password"} placeholder="userpassword" className="input" name="userpassword" />
                    {
                        showPass
                            ? <FaRegEye onClick={() => hidePass((prev) => !prev)} />
                            : <FaEyeSlash onClick={() => hidePass((prev) => !prev)} />

                    }
                </div>

                <button className="btn">Register</button>
                <Link to={"/signin"}>Sign In</Link>
            </form>
        </div>
    );
}

export default SignUp;