import express from "express"
import { singin,signup,logout } from "../controller/auth.Controller.js";
const router = express.Router();

router.post("/signup",signup)

router.post("/login",singin)

router.post("/logout",logout)

export default router;