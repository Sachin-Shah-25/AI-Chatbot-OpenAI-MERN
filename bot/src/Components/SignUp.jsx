import { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { FaRegEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom'
const DABASE_URL = import.meta.env.VITE_DABASE_URL

function SignUp() {
    const [userData, setUserData] = useState({ username: "", useremail: "", userpassword: "" })
    const [showPass, hidePass] = useState(false)
    const [showError, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const getNavigate = useNavigate()


    const handleChange = (e) => {
        setUserData(prev => {
            return { ...prev, [e.target.name]: (e.target.value).trim() }
        })
    }
    const signUpFun = (e) => {
        e.preventDefault()
        setLoading(true)
        setTimeout(async () => {
            setLoading(false)
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
                const { data } = await axios.post(`${DABASE_URL}/auth/signup`, userData, { withCrendential: true })

                getNavigate("/signin", { state: { message: "Created! Please SignIn" } })

            }
            catch (err) {
                const erroCode = err.response.status
                console.log(err.response.data.message)
                if (erroCode >= 400 && erroCode < 500) {
                    setError(err.response.data.message)
                }
            }
        }, 2000)
    }
    return (
        <div className="container">
            <form className="form" onSubmit={(e) => signUpFun(e)} style={{ backgroundColor: loading && "f3f3f3", opacity: loading && "0.5" }}>
                {
                    showError
                        ? <div className="error_msg">{showError}</div>
                        : ""
                }
                <h2>Sign Up</h2>
                <input readOnly={loading && loading} onFocus={() => setError(false)} onChange={e => handleChange(e)} type="text" placeholder="username" className="input" name="username" />
                <input readOnly={loading && loading} onFocus={() => setError(false)} onChange={e => handleChange(e)} type="email" placeholder="useremail" className="input" name="useremail" />
                <div className="input_div">
                    <input readOnly={loading && loading} onFocus={() => setError(false)} onChange={e => handleChange(e)} type={showPass ? "text" : "password"} placeholder="userpassword" className="input" name="userpassword" />
                    {
                        showPass
                            ? <FaRegEye onClick={() => hidePass((prev) => !prev)} />
                            : <FaEyeSlash onClick={() => hidePass((prev) => !prev)} />

                    }
                </div>

                <button disabled={loading && loading} style={{cursor:loading && "not-allowed"}} className="btn">Register</button>
                <Link to={"/signin"}>Sign In</Link>
            </form>
        </div>
    );
}

export default SignUp;
