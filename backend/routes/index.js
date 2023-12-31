import express from "express";
import user_router from "./auth_router.js";
import chat_router from "./chat_router.js";

const router = express.Router()

router.use("/auth/", user_router)
router.use("/chat/", chat_router)

export default router