import express from "express";
import UserController from "../controller/UserController.js";
const router = express.Router();
import auth from "../middlewares/auth.js"

router.get("/", (req, res) => {
    res.send("Hello world")
})

router.post('/login/', UserController.login);

router.post('/register/', UserController.register);

router.get('/get_me/', auth, UserController.getMe)

export default router
