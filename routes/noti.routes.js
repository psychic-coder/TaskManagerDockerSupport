import express from "express"
import { isAuthenticated } from "../middlewares/auth.js";
import { getUserNotifications } from "../controllers/noti.controller.js";

const router=express.Router()

router.get("/", isAuthenticated, getUserNotifications);


export default router;
