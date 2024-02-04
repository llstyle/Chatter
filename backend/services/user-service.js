import User from "../models/User.js";
import Activation from "../models/Activation.js";
import mailService from "../services/mail-service.js";
import tokenService from "../services/token-service.js";

import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from 'uuid';

import ApiError from "../exceptions/api-error.js";
import mongoose from "mongoose";

class UserService {
    async registration(body, session) {
        const {username, email, password, firstname, lastname } = body;

        const oldUser = await User.findOne({ email });

        if (oldUser) {
           throw ApiError.BadRequest("User Already Exist")
        }
        const encryptedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username: username,
            email: email.toLowerCase(),
            firstname: firstname,
            lastname: lastname,
            password: encryptedPassword,
        });

        const activationLink = uuidv4();
        await Activation.create({ user: user._id, activationLink })

        await mailService.sendActivationMail(email, `${process.env.API_URL}/auth/activate/${activationLink}`)
    }

    async activate(link) {
        if(!link) {
            throw ApiError.BadRequest('Link is required')
        }

        const verified = await Activation.findOne({activationLink: link})
        if (!verified) {
            throw ApiError.BadRequest('Link is incorrect')
        }
        await User.findOneAndUpdate({ _id: verified.user}, {verified: true})
        await Activation.findByIdAndDelete(verified._id);
    }

    async login(body) {
        const { email, password } = body;

        const user = await User.findOne({ email, verified: true });

        if (!(user && (await bcrypt.compare(password, user.password)))) {
            throw ApiError.BadRequest("Invalid Credentials")
        }

        const tokens = tokenService.generateTokens({user_id: user._id, username: user.username, email: user.email});
        await tokenService.saveToken(user._id, tokens.refreshToken);

        return tokens
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }

        const userData = tokenService.validateRefreshToken(refreshToken);

        const tokenFromDb = await tokenService.findToken(refreshToken);

        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }

        const user = await User.findById(userData.user_id);
        const tokens = tokenService.generateTokens({user_id: user._id, username: user.username, email: user.email});

        await tokenService.saveToken(user._id, tokens.refreshToken);

        return tokens
    }
}

export default new UserService();