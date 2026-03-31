import express from 'express'
import cors from 'cors'
import cookieparser from 'cookie-parser'
import dotenv from 'dotenv'
dotenv.config()
import ResponseFun from './helpers/SuccessFun.js'
import AuthRouter from './Routers/AuthRouter.js'
import mongoose from 'mongoose'
import Groq from 'groq-sdk'
import booking from './Models/BookingModel.js'
import jwt from 'jsonwebtoken'
import authenticationModel from './Models/AuthModel.js'

const app = express()



const option = {
    origin: ["http://localhost:5173"],
    credentials: true
}
app.use(cors(option))
app.use(express.json())
app.use(cookieparser())





export const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
})

let userState = {
    intent: "",
    state: {
        data: {
            age: null,
            name: null,
            gender: null,
            email: null,
            phone: null,
            date: null,
            time: null,
            dep: null
        }
    }
}
let booked = null
let cancel = null


async function findUserIntent(message) {
    const response = await groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `You are an AI assistant for an appointment booking system.

                    Your job is to analyze the user's message and extract structured data.

                    Return ONLY valid JSON. No explanation.

                    Format:
                    {
                    "intent": "book | cancel | reschedule | general",
                    "date": "YYYY-MM-DD or null",
                    "time": "HH:MM or null",
                    "isRelevant": true or false,
                    "name": string | null,
                    "phone": string | null,
                    "email": string | null,
                    "dep": string | null,
                    "date": string | null,
                    "age": string | null,
                    "gender": string | null,
                    }

                    Rules:

                    - "book" → user wants to create appointment
                    - "cancel" → user wants to cancel
                    - "reschedule" → user wants to change time/date
                    - "general" → greeting, questions, or unrelated
                    - Detect intent clearly
                    - Extract user details only if explicitly mentioned
                    - Normalize date to YYYY-MM-DD
                    - Normalize time to HH:MM (24-hour)
                    - If message is unrelated → isRelevant = false
                    - Do not guess missing data
                    - If user message contains only a number:
                    - If length is 10 → treat as phone number
                    - If user provides personal details (name, age, phone, email, gender, department etc.) without explicitly saying "book", assume intent = "book"

                    -If user provides structured details like name, age, phone, email, gender etc. → set intent = "book" (assume user is in booking flow)
                    x
                    - Extract date and time if mentioned
                    - Convert relative terms:
                    - "today", "aaj"
                    - "tomorrow", "kal"
                    - Convert time:
                    - "morning" → 09:00
                    - "afternoon" → 14:00
                    - "evening" → 18:00
                    - "night" → 21:00

                    - If message is unrelated (like "hello", "price kya hai", "kaun ho tum"), set isRelevant = false

                    Examples:
                    User: "Mera naam Rahul hai"
                    Output:
                    {"intent":"general","name":"Rahul",age:null,gender:null,"phone":null,"email":null,"dep":null,"date":null,"time":null,"isRelevant":true}

                    User: "age 23 or gender male"
                    Output:
                    {"intent":"general","name":null,age:23,gender:male,"phone":null,"email":null,"dep":null,"date":null,"time":null,"isRelevant":true}

                    User: "kal dentist ka appointment book karna hai"
                    Output:
                    {"intent":"book","name":null,age:null,gender:null,"phone":null,"email":null,"dep":"dentist","date":"2026-03-29","time":null,"isRelevant":true}

                    User: "hello"
                    Output:
                    {"intent":"general",age:null,gender:null,"name":null,"phone":null,"email":null,"dep":null,"date":null,"time":null,"isRelevant":false
                    `
            }
            ,
            {
                role: "user",
                content: message
            }
        ],
        model: "openai/gpt-oss-120b"
    })
    const content = response.choices[0].message.content
    return content
}
async function helpUser(message) {
    const response = await groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `You are a doctor and also a friendly boy to give advice according to user health condition and give medicale advice after focusing user's symptons and give answer in English langauge 
                
                 Rules:
                 - Give answer in one english.
                 - Don't write extra text.
                 - List symptoms line by line.
                 - If multiple symptoms → suggest multiple departments (line by line)
                 - Then list only department name(s)
                 - keep result clean 
                 - Don't write bullet
                 - Bold Department and Symptoms word
               Format: 

                Symptoms you are facing:
                - <symptom 1>
                - <symptom 2>

                Department:
                - <department 1>
                - <department 2>

                Symptoms you are facing:
                - Fever lasting several days
                - Body pain

                Department:
                - General Medicine
                `
            }
            ,
            {
                role: "user",
                content: message
            }
        ],
        model: "openai/gpt-oss-120b"
    })
    const content = response.choices[0].message.content
    return content
}

function getAllDet(userState) {
    return userState.state.data.name &&
        userState.state.data.age &&
        userState.state.data.gender &&
        userState.state.data.email &&
        userState.state.data.date &&
        userState.state.data.time &&
        userState.state.data.dep
}
let curr = true
app.post("/bot/chat", async (req, res, next) => {
    if (!req.cookies["token"]) {
        return res.status(409).json({ isLogged: true, success: false, message: "Login Again" })
    }
    try {
        const { message } = req.body;
        const getIntent = await findUserIntent(message)
        const intent = JSON.parse(getIntent)
        const datafileds =
            ["name", "age", "gender", "email", "phone", "date", "time", "dep"];
        const isData = datafileds.every(field => !intent[field])
        if (isData && intent.intent == 'general' && isNaN(Number.parseInt(message))) {
            if (!getAllDet(userState)) {

                if (message == "yes") {
                    curr = null
                    return res.status(201).json({ success: false, isConfirm: false, next: "Enter Your Name" });
                }
                curr = "advice"

                const aiHelp = await helpUser(message)
                return res.status(201).json({ success: false, isConfirm: false, next: `${aiHelp} may I book appointmen for you ` });
            }
        }

        userState.intent = intent.intent
        if (!booked && intent.intent == "book") {
            booked = "book"
        }
        if (!cancel && intent.intent == "cancel") {
            cancel = "cancel"
        }


        // 88888888888888888888 Cancelleation Proccess 88888888888888
        curr = null
        if (cancel && intent.intent != "book") {
            curr = null
            booked = null

            if (!isNaN(Number.parseInt(message))) {
                return await cancelApp(req, res, next, message)
            }
            return res.status(201).json({ success: false, isConfirm: false, next: "Enter Appointment Id" });
        }



        datafileds.forEach((field) => {
            if (intent[field]) {
                userState.state.data[field] = intent[field]
            }
        })
        if (!userState.state.data.name) {
            return res.status(201).json({ success: false, isConfirm: false, next: "Enter Your Name" });
        }

        if (!userState.state.data.age) {
            return res.status(201).json({ success: false, isConfirm: false, next: "Enter Your Age" });
        }

        if (!userState.state.data.gender) {
            return res.status(201).json({ success: false, isConfirm: false, next: "Enter Your Gender" });
        }

        if (!userState.state.data.email) {
            return res.status(201).json({ success: false, isConfirm: false, next: "Enter Your Email" });
        }

        // if (!userState.state.data.phone) {
        //     return res.status(201).json({ success: false, next: "Enter Your Phone" });
        // }

        if (!userState.state.data.date) {
            return res.status(200).json({ success: false, isConfirm: false, next: "Enter Appointment Date" });
        }

        if (!userState.state.data.time) {
            return res.status(200).json({ success: false, isConfirm: false, next: "Enter Appointment Time" });
        }

        if (!userState.state.data.dep) {
            return res.status(200).json({ success: false, isConfirm: false, next: "Which Department d you want to consult ?" });
        }


        if (getAllDet(userState)) {
            cancel = null
            if (booked !== "book") {
                booked = "book"
                return res.status(200).json({ success: false, isConfirm: false, next: "You want to book Appointement ?" });
            }

            if (message == "yes" && booked == "book") {
                return await saveApp(req, res, next)
            }

            return res.status(201).json({
                success: false,
                message: "Confrim Appointment ",
                isConfirm: true,
                confirm:
                    `Confirm Details :-,
                    Name : ${userState.state.data.name}, 
                    Age : ${userState.state.data.age}, 
                    Gender : ${userState.state.data.gender}, 
                    Email : ${userState.state.data.email}, 
                    Date : ${userState.state.data.date}, 
                    Time : ${userState.state.data.time}, 
                    Department : ${userState.state.data.dep}
                ,
                Say "YES" If this correct , If not please write what is change ?
                `

            })


        }
    }
    catch (e) {
        next(e)
    }


})



async function saveApp(req, res, next) {
    try {
        const token = req.cookies["token"]
        if (!token) {
            return res.status(409).json({ success: false, message: "Login Again" })
        }
        const decoded = jwt.verify(token, process.env.MY_TOKEN_KEY)

        const findUser = await authenticationModel.findOne({
            useremail: decoded.payload.useremail
        })
        if (!findUser.useremail) {
            return res.status(409).json({ success: false, message: "Login Again" })
        }
        var appid = Math.floor(100000 + Math.random() * 900000)
        const isBookingCreated = await booking.create({
            userId: findUser._id,
            ...userState.state.data,
            appid
        })
        userState = {
            intent: "",
            state: {
                data: {
                    age: null,
                    name: null,
                    gender: null,
                    email: null,
                    phone: null,
                    date: null,
                    time: null,
                    dep: null
                }
            }
        }
        booked = null;
        cancel = null;
        return res.status(200).json({ success: true, isConfirm: true, appDone: true, message: "Appointement Done", appid })
    } catch (e) {
        next(e)
    }
}

async function cancelApp(req, res, next, message) {
    try {
        const token = req.cookies["token"]
        if (!token) {
            return res.status(409).json({ success: false, message: "Login Again" })
        }

        const isHasAppointment = await booking.findOneAndDelete({ appid: message })
        if (!isHasAppointment || !isHasAppointment.email) {
            return res.status(409).json({ success: false, isConfirm: false, message: "No Appointment Found" })
        }

        return res.status(200).json({ success: true, isConfirm: true, intent: "cancel", message: "Your Appointment has cancelled", confirm: isHasAppointment })
    } catch (e) {
        next(e)
    }
}







app.use("/auth", (req, res, next) => {
    next()
}, AuthRouter)


app.get("/me", (req, res, next) => {
    try {
        if (!req.cookies.token) {
            return ResponseFun(res, 409, false, "Login Again")
        }
        return ResponseFun(res, 200, true, "Founed")
    }
    catch (e) {
        next(e)
    }
})

app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message
    });
})


mongoose.connect(process.env.DATABASE_KEY).then(() => console.log("success")).catch((e) => console.log(e.message));
app.listen(8000, function () {
    console.log("Server Started At : ", 8000);
})