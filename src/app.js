import express from "express";
import cors from 'cors'
import cookieParser from "cookie-parser";

const app = express();

app.use(cors())
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(express.static('public'))

//routers import
import userRouter from "./routers/user.router.js";

//routes declaration
app.use("/api/v1/user",userRouter)

export { app };
