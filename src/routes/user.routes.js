import { Router } from "express";
import { registerUser,loginUser,updatePassword} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router=Router();

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/changePassword").put(verifyToken,updatePassword)
export{
    router
}