import bcrypt from 'bcryptjs'
import authenticationModel from '../Models/AuthModel.js'
import ResponseFun from '../helpers/SuccessFun.js'
import tokencreatefun from '../Utiles/tokenGen.js'
export const SignUpFun = async (req, res, next) => {

    try {
        const { username, useremail, userpassword } = req.body
        const userExists = await authenticationModel.findOne({ useremail: useremail.toLowerCase() })
        if (userExists) {
            const err = new Error("Email Alreay Exists");
            err.statusCode = 409;
            throw err;
        }
        const secure_pass = await bcrypt.hash(userpassword, 10)

        const isAccCreated = await authenticationModel.create({ username, useremail, userpassword: secure_pass })

        if (isAccCreated) {
            return ResponseFun(res, 201, true, "Created")
        }

    }
    catch (e) {
        next(e)
    }
}
export const SignInFun = async (req, res, next) => {
    try {
        const { useremail, userpassword } = req.body
        const userExists = await authenticationModel.findOne({ useremail })
        if (!userExists) {
            const err = new Error("Email Not Found");
            err.statusCode = 409;
            throw err;
        }
        const real_password = await bcrypt.compare(userpassword, userExists.userpassword)
        if (!real_password) {
            const err = new Error("Password doesn't Match");
            err.statusCode = 409;
            throw err;
        }

        const usertoken = tokencreatefun(userExists.username, userExists.useremail)

        res.cookie("token", usertoken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 24 * 3 * 60 * 60 * 1000
        })

        return ResponseFun(res, 200, true, "Login Successfully", userExists)
    }
    catch (e) {
        next(e)
    }
}



