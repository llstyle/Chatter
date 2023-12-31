import * as dotenv from 'dotenv'
dotenv.config()

import express from "express"
import http from 'http'

import { Server } from 'socket.io'

import mongoose from "mongoose";
import router from "./routes/index.js";

import cookieParser from "cookie-parser"
import cors from "cors"

import onConnection from './handlers/onConnection.js'
import authSocket from './middlewares/authSocket.js'

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.ORIGIN,
    }
});

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

io.use(authSocket)

io.on("connection", onConnection);

async function startApp() {
    try {
        await mongoose.connect(DB_URL)
        server.listen(PORT, "192.168.1.13", () => console.log('listening on *:3000'))    
    } catch (e) {
        console.log(e)
    }
}

startApp()