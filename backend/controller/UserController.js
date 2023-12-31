import * as dotenv from 'dotenv'
dotenv.config()
import User from "../models/User.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const TOKEN = process.env.TOKEN
class UserController {
     async register(req, res) {
         try {
             const {username, email, password, firstname, lastname } = req.body;

             if (!(email && password && username)) {
                 res.status(400).send("All input is required");
             }
             const oldUser = await User.findOne({ email });

             if (oldUser) {
                 return res.status(409).send("User Already Exist. Please Login");
             }

             const encryptedPassword = await bcrypt.hash(password, 10);

             const user = await User.create({
                 username: username,
                 email: email.toLowerCase(),
                 firstname: firstname,
                 lastname: lastname,
                 password: encryptedPassword,
             });

             const token = jwt.sign(
                 {user_id: user._id, username: user.username, email},
                 TOKEN,
                 {
                     expiresIn: "2h",
                 }
             );
             res.status(201).json({ token });
         } catch (err) {
             console.log(err);
         }
     }
    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!(email && password)) {
                res.status(400).send("All input is required");
            }
            const user = await User.findOne({ email });

            if (user && (await bcrypt.compare(password, user.password))) {
                const token = jwt.sign(
                    { user_id: user._id, username: user.username, email },
                    TOKEN,
                    {
                        expiresIn: "2h",
                    }
                );
                res.status(200).json({token})
            } else {
                res.status(400).send("Invalid Credentials");
            }
        } catch (err) {
            console.log(err);
        }
    }
    async search(req, res) {
        try {
            const {search} = req.query
            const users = await User.find({username: { "$regex": search, "$options": "i" }, _id: {$ne: req.user.user_id}}, "_id username firstname lastname").limit(10)
            res.status(200).json(users)
        } catch (err) {
            console.log(err);
        }
    }
    async getMe(req, res) {
         res.status(200).json(req.user.username)
    }
 }
 export default new UserController()