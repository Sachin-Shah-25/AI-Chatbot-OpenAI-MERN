import mongoose from 'mongoose'


const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "authuser"
    },
    name: {
        type: String
    },
    age: {
        type: String
    },
    gender: {
        type: String
    },
    problem:{
        type:String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    dep:{
        type:String
    },
    date:{
        type:String
    },
    appid:{
        type:String
    }
}, { timestamp: true })

const booking = mongoose.model("bookingapp", bookingSchema)

export default booking