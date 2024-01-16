import * as dotenv from 'dotenv'
dotenv.config()

import jwt from "jsonwebtoken";

const TOKEN = process.env.JWT_ACCESS_SECRET

const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"]
    if (token) {
        try {
            req.user = jwt.verify(token, TOKEN);
        } catch (err) {
            return res.status(401).send("Invalid Token");
        }
    }
    else {
        return res.status(403).send("A token is required for authentication");
    }
    return next();
};

export default verifyToken;