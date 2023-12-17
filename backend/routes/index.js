import express from "express";
import user_router from "./auth_router.js";

const router = express.Router()

router.use("/auth/", user_router)

export default router