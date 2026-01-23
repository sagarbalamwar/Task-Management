import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { createTask, getAllTask } from "../controllers/task.controller.js";

const router=Router();

router.route("/create").post(verifyToken,createTask)
router.route("/getAll").get(verifyToken,getAllTask)
export{
    router
}