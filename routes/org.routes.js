import express from "express"
import { authorizeRoles, isAuthenticated } from "../middlewares/auth.js";
import { changeUserRole, getOrganizationDetails, listOrganizationDetails, updateOrganizationDetails } from "../controllers/org.controller.js";

const router=express.Router();

router.use(isAuthenticated,authorizeRoles("ADMIN"))
router.get("/:id",getOrganizationDetails);
router.patch("/:id",updateOrganizationDetails);
router.get("/:id/members",listOrganizationDetails);
router.patch("/:id/role",changeUserRole);

export default router;


