import express from "express";
import UserController from "../controller/UserController.js";
const router = express.Router();
import auth from "../middlewares/auth.js"
import { loginValidator, registerValidator } from "../validations/register.js";

router.get("/", (req, res) => {
    res.send("Hello world")
})

router.post('/login', loginValidator, UserController.login);

router.post('/register', registerValidator, UserController.register);

router.get('/activate/:link', UserController.activation);

router.get('/refresh', UserController.refresh);

router.get('/search', auth, UserController.search);

router.get('/get_me', auth, UserController.getMe)

export default router
