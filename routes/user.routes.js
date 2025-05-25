import express from "express"
import { getProfile, removeUserFromOrg } from "../controllers/user.controller.js";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth.js";

const router =express.Router();

router.get("/:id",isAuthenticated,getProfile);
router.delete("/:id",isAuthenticated,authorizeRoles("ADMIN"),removeUserFromOrg);


export default router;