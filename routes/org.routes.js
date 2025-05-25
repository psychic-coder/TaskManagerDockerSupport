import express from "express"
import { authorizeRoles, isAuthenticated } from "../middlewares/auth.js";
import { changeUserRole, generateInvite, getOrganizationDetails, listOrganizationDetails, updateOrganizationDetails } from "../controllers/org.controller.js";

const router=express.Router();

router.use(isAuthenticated,authorizeRoles("ADMIN","MANAGER"))
router.get("/:id",getOrganizationDetails);
router.patch("/:id",updateOrganizationDetails);
router.get("/:id/members",listOrganizationDetails);
router.patch("/:id/role",changeUserRole);
router.post("/invite",generateInvite);

export default router;


