import jwt from "jsonwebtoken";
import User from "../models/user.model.js"

export const protectedRoute= async(req,res,next)=>{
    try {
    
    const token = req.cookies.jwt;

    if(!token) return res.status(401).json({message: "Unauthorized User - Please Provide the token"})

    const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY)

    if(!decoded) return res.status(401).json({message : "Unauthorized User - Invalid Token"})

    const user = await User.findById(decoded.userId).select("-password") // remove password from the get details

    if(!user) return res.status(401).json({message : "No such user find in Database"})

    req.user = user

    next();
        
    } catch (error) {
        
        console.log("Error in the auth middleware : ",error);
        res.status(500).json({message : "internal server error"});
    }

}