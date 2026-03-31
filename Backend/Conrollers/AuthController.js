import bcrypt from 'bcryptjs'
import authenticationModel from '../Models/AuthModel.js'
import ResponseFun from '../helpers/SuccessFun.js'
import tokencreatefun from '../Utiles/tokenGen.js'
export const SignUpFun = async (req, res, next) => {

    try {
        const { username, useremail, userpassword } = req.body
        const userExists = await authenticationModel.findOne({ useremail: useremail.toLowerCase() })
        console.log("1")
        if (userExists) {
            const err = new Error("Email Alreay Exists");
            err.statusCode = 409;
            throw err;
        }
        console.log("2")
        const secure_pass = await bcrypt.hash(userpassword, 10)

        console.log("3")
        const isAccCreated = await authenticationModel.create({ username, useremail, userpassword: secure_pass })

        console.log("4")
        console.log(isAccCreated)
        if (isAccCreated) {
            return ResponseFun(res, 201, true, "Created")
        }

    }
    catch (e) {
        next(e)
    }
}
export const SignInFun = async (req, res, next) => {
    console.log("1")
    try {
        const { useremail, userpassword } = req.body
        const userExists = await authenticationModel.findOne({ useremail })
        console.log("2")

        if (!userExists) {
            const err = new Error("Email Not Found");
            err.statusCode = 409;
            throw err;
        }
        console.log("3")
        const real_password = bcrypt.compare(userpassword, userExists.userpassword)
        if (!real_password) {
            const err = new Error("Password doesn't Match");
            err.statusCode = 409;
            throw err;
        }

        console.log("4")
        const usertoken = tokencreatefun(userExists.username, userExists.useremail)

        console.log("5")
        res.cookie("token", usertoken, {
            httpOnly: true,
            secure: true,
            sameSite:"none",
            maxAge: 24 * 3 * 60 * 60 * 1000
        })

        console.log("done")
        return ResponseFun(res, 200, true, "Login Successfully", userExists)
    }
    catch (e) {
        next(e)
    }
}



