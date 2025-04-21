import express from 'express'
import {sequelize, ConnectDb } from './config/dbConnect.js';
import cors from "cors"
import userRouter from './routes/user.routes.js';
import vRouter from './routes/verificationofficer.routes.js';
import candidaterouter from "./routes/candidate.routes.js"
import boothofficerrouter from "./routes/boothOfficer.routes.js"
import voterouter from "./controllers/votes.controller.js"
import dotenv from "dotenv"
import './config/associations.js'
import cookieParser from 'cookie-parser';
import User from './models/voter.model.js';
import registrationRouter from './routes/registration.routes.js'
import VerificationOfficer from './models/verification_officer.model.js';
import authRouter from './routes/authentication.routes.js'
dotenv.config()

const app = express()
const PORT = 5000;

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ limit: '2mb', extended: true }));


app.use(cookieParser())


app.use(cors({
    origin : "http://localhost:5173",
    credentials: true  
  }));




app.get('/',(req,res)=>{
    res.send('Server is Running 🚀')
})

app.use('/api',userRouter)
app.use('/api',vRouter)
app.use('/api',candidaterouter)
app.use('/api',boothofficerrouter)
app.use('/api',voterouter)
app.use('/api',registrationRouter)
app.use('/api/authentication',authRouter)


const StartServer = async()=>{

    await ConnectDb() //dbConnection
    
    await sequelize.sync()
    console.log("✅ All models were Synchronized Successfully!")
    console.log(User.associations);
console.log(VerificationOfficer.associations);

    
    app.listen(PORT,'0.0.0.0',()=>{
        console.log('Server Running on PORT : ',PORT)
    })

}

StartServer()