import { app } from "./app.js"
import connectDb from "./db/index.js"
import dotenv from 'dotenv'

dotenv.config({
    path: "./.env" 
})

connectDb()
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log('Server is started');
    })
})
.catch((err)=>{
    console.log("DB connection err at index::",err);
})