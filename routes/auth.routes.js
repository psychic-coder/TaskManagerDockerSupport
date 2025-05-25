import express from "express"
import { getMe, login, register } from "../controllers/auth.controllers.js";
import {  isAuthenticated } from "../middlewares/auth.js";

const router= express.Router();


router.post("/register",register);
router.post("/login",login);
router.get("/me",isAuthenticated,getMe)


export default router;