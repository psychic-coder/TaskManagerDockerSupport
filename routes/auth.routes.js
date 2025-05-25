import express from "express"
import { getMe, joinWithInvite, login, register } from "../controllers/auth.controller.js";
import {  isAuthenticated } from "../middlewares/auth.js";

const router= express.Router();


router.post("/register",register);
router.post("/login",login);
router.get("/me",isAuthenticated,getMe)
router.post("/join/:token",joinWithInvite);



export default router;