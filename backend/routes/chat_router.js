import express from "express";
import ChatController from "../controller/ChatController.js";
const router = express.Router();
import auth from "../middlewares/auth.js"

router.post('/create', auth, ChatController.createChat);
export default router
