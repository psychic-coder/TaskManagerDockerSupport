import express from "express"
import { authorizeRoles, isAuthenticated } from "../middlewares/auth.js";
import { getMemberTaskSummary, getOrgDashboardSummary } from "../controllers/dashboard.controller.js";



const router=express.Router();

router.get("/summary", isAuthenticated, authorizeRoles("ADMIN","MANAGER"), getOrgDashboardSummary);
router.get("/member-tasks", isAuthenticated, getMemberTaskSummary);


export default router;