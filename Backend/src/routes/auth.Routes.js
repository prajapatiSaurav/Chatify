import express from "express"
import { singin,signup,logout,onboarding } from "../controller/auth.Controller.js";
import {protectedRoute}  from "../middleware/auth.middleware.js"
const router = express.Router();

router.post("/signup",signup)

router.post("/login",singin)

router.post("/logout",logout)

router.post("/onboarding" , protectedRoute , onboarding)

//Check User is loged in or not
router.get("/me",protectedRoute,(req,res)=>{
    res.status(200).json({success : true , User : req.user})
})

export default router;