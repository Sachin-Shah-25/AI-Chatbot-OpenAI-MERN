import jwt from 'jsonwebtoken'


function tokencreatefun(username,useremail){
    return jwt.sign({
        payload:{
           username,useremail
        }
    },process.env.MY_TOKEN_KEY)
}

export default tokencreatefun