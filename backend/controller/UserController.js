import User from "../models/User.js";
import mongoose from "mongoose";

import userService from "../services/user-service.js";

import ApiError from "../exceptions/api-error.js";
import { validationResult } from "express-validator";


class UserController {
     async register(req, res, next) {
        const session = await mongoose.startSession()
         try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw ApiError.BadRequest("All inputs is required", errors.array())
            }
            session.startTransaction()

            await userService.registration(req.body)

            await session.commitTransaction()
            return res.status(201).send("Seccessful sended email verification")
         } catch (err) {
             await session.abortTransaction()
             next(err)
         }
         session.endSession()
     }
    async login(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw ApiError.BadRequest("All inputs is required", errors.array())
            }
            const tokens = await userService.login(req.body)

            res.cookie('refreshToken', tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'none', secure: true})
            return res.status(200).json(tokens)
        } catch (err) {
            next(err)
        }
    }
    async activation(req, res, next) {
        try {
            const {link} = req.params
            await userService.activate(link)
            return res.status(200).send("Seccessful activation, now you can login")
        } catch(e) {
            next(e)
        }
    }
    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies;

            const tokens = await userService.refresh(refreshToken)
            res.cookie('refreshToken', tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'none', secure: true})
            
            return res.status(200).json(tokens)
        } catch(e) {
            next(e)
        }
    }
    async search(req, res, next) {
        try {
            const {search} = req.query
            const users = await User.find({username: { "$regex": search, "$options": "i" }, _id: {$ne: req.user.user_id}, verified: true}, "_id username firstname lastname").limit(10)
            res.status(200).json(users)
        } catch (err) {
            next(err)
        }
    }
    async getMe(req, res) {
         res.status(200).json(req.headers["user-agent"])
    }
 }
 export default new UserController()