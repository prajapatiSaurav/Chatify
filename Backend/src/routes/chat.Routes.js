import express from "express";
import {protectedRoute} from "../middleware/auth.middleware.js"
import {userChatgetToken} from "../controller/userchat.Controller.js"


const router = express.Router();

router.use(protectedRoute)

router.post("/user-chat", userChatgetToken)
export default router;