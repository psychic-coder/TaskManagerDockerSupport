import express from "express";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth.js";
import { assignTask, completeTask, createTask, deleteTask, getAllTasks, getTaskById, pickTask, updateTask } from "../controllers/task.controller.js";


const route=express.Router();


route.post("/create",isAuthenticated,authorizeRoles("ADMIN"),createTask)
route.get("/getTasks",isAuthenticated,getAllTasks)
route.get("/getTasks/:id",isAuthenticated,getTaskById)
route.patch("/updateTask/:id", isAuthenticated,authorizeRoles("ADMIN") , updateTask);
route.delete("/delete/:id", isAuthenticated,authorizeRoles("ADMIN") , deleteTask);
route.post("/assign/:id",isAuthenticated,authorizeRoles("MANAGER","ADMIN") , assignTask);
route.post("/pick/:id",isAuthenticated , pickTask);
route.post("/completeTask/:id",isAuthenticated , completeTask);



export default route;