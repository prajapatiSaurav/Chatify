import jwt from "jsonwebtoken";
import User from "../models/user.model.js"
import {upsertStreamUser} from "../lib/stream.js"

export async function signup(req,res){
    const {email , fullName , password} = req.body;

    try{
        if(!email || !fullName || !password){
            return res.status(400).json({message : "All fields are required"})
        }

        if (password.length < 6){
            return res.status(400).json({message : "password must be at least 6 characters"})
        }

        const emailcheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailcheck.test(email)){
            return res.status(400).json({message : "Invalid email formate"})
        }

        const user_exist = await User.findOne({email});

        if(user_exist){
            return res.status(400).json({message : "Email allready used , please use diff Email"})
        }

        const random = Math.floor(Math.random()*100) + 1;

        const random_profile = `https://avatar.iran.liara.run/public/${random}`  // random profile pics

        const newUser = await User.create({
            email,
            fullName,
            password,
            profilePic : random_profile
        })

        //creating stream user
        try {
            await upsertStreamUser({
            id : newUser._id.toString(),
            name : newUser.fullName,
            image : newUser.profilePic || ""
        })
        } catch (error) {
            console.log("Error while creating the stream user in the auth controller")
        }

        const token = await jwt.sign({userId : newUser._id},process.env.JWT_SECRET_KEY,{
            expiresIn : "7d"
        })

        res.cookie("jwt", token ,{
            maxAge : 7 * 24 * 60 * 60,
            httpOnly : true,    // prevent xss attack
            sameSite : "strict", // prevent CSRF attack
            secure : process.env.NODE_ENV === "production"
        })

        res.status(201).json({success:true, user:newUser})
  
    }catch(error){
        console.log("Error in Signup : ",error)
        res.status(500).json({message:"Internal Server Error"})

    }
}


export async function singin(req,res) {
    
     try {
        const {email,password} = req.body;

        if(!password || !email){
            return res.status(400).json({message:"All the fields are required"})
        }

        const user = await User.findOne({email});

        if(!user) return res.status(401).json({message:"invalid email or password"});

        const ispasswordcurrect = await user.matchPassword(password);

        if(!ispasswordcurrect) {
        
            return  res.status(401).json({message:"invalid email or password"})
        };

        const token = await jwt.sign({userId : user._id},process.env.JWT_SECRET_KEY,{
            expiresIn : "7d"
        })
        
        
        res.cookie("jwt", token ,{
            maxAge : 7 * 24 * 60 * 60,
            httpOnly : true,    // prevent xss attack
            sameSite : "strict", // prevent CSRF attack
            secure : process.env.NODE_ENV === "production"
        })

        res.status(200).json({success : true,user});
        
    } catch (error) {
        console.log("Error in singin function : ",error);
        res.status(500).json({message : "Internal Server Error"});        
    }
}

export function logout(req,res){
   res.clearCookie("jwt")
   res.status(200).json({success:true, message:"Log out successfull"})
}

export async function onboarding(req,res){
    try{
        const userId = req.user._id;

        const {fullName ,bio ,nativeLanguage ,learningLanguage ,location} = req.body;

        if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location){
            return res.status(400).json({
                message : "All fields are required",
                missingFields : [
                    !fullName && "fullName",         //false && "anything" → returns false (Boolean)
                    !bio && "bio",                   // true && "something" → returns "something" (String)
                    !learningLanguage && "learningLanguage",
                    !nativeLanguage && "nativeLanguage",
                    !location && "location" 
                ].filter(Boolean)
            })
        }

        const updatedUser= await User.findByIdAndUpdate(userId,{
            ...req.body,
            isOnboarded : true
        },{new:true})

        if(!updatedUser) return res.status(404).json({message : "User not found"})

        try {
            await upsertStreamUser({
                id : updatedUser._id.toString(),
                name : updatedUser.fullName,
                image : updatedUser.profilePic || ""
            })

            console.log("Data in stream id updated")
        } catch (error) {
            console.log("Error while updating Data in stream",error.message)
        }

        res.status(200).json({success : true , user : updatedUser})


    }catch(error){
        console.log("Error in the Onboarding : ",error);
        res.status(500)({message : "Internal server error"})
    }

}