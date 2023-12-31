import * as dotenv from 'dotenv'
dotenv.config()

import jwt from "jsonwebtoken";

const TOKEN = process.env.TOKEN

const authSocket = (socket, next) => {
    const token = socket.handshake.auth.token
    if (token) {
        try {
            socket.user = jwt.verify(token, TOKEN)
            next()
        } catch (err) {
            next(new Error('Authentication error'))
        }
    }
    else {
        next(new Error('Authentication error'))
    }
};

export default authSocket;