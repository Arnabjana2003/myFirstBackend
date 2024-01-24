const asyncHandler = (func)=> async(req,res,next)=>{
    try {
       await func(req,res,next);
    } catch (error) {
        console.log("error is :",error);
        res.status(error.statusCode || error.http_code || 500).send(error)
    }
}

export default asyncHandler