import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { createTask, getAllTask, getSingleTask } from "../controllers/task.controller.js";

const router=Router();

router.route("/create").post(verifyToken,createTask)
router.route("/getAll").get(verifyToken,getAllTask)
router.route("/getSingleTask/:id").get(verifyToken,getSingleTask)
export{
    router
}