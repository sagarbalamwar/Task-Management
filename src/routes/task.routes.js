import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { createTask } from "../controllers/task.controller.js";

const router=Router();

router.route("/create").post(verifyToken,createTask)

export{
    router
}