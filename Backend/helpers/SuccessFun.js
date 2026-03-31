
function ResponseFun(res,code,success,msg,data=""){

    return res.status(code).json({success,msg,res:data})
}

export default ResponseFun