import * as dotenv from 'dotenv'
dotenv.config()
import express from "express"
import mongoose from "mongoose";
import router from "./routes/index.js";

import cookieParser from "cookie-parser"
import cors from "cors"

const app = express();

const DB_URL = process.env.MONGO_URL
const PORT = 3000

const corsOptions = {
    origin: process.env.ORIGIN,
    credentials:true,
    optionSuccessStatus:200
}
app.use(cors(corsOptions))

app.use(cookieParser())

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));


app.use("/", router)

async function startApp() {
    try {
        await mongoose.connect(DB_URL)
        app.listen(PORT, () => console.log('SERVER STARTED ON PORT ' + PORT))
    } catch (e) {
        console.log(e)
    }
}

startApp()