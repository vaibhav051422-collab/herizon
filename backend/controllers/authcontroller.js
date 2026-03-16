import mongoose from "mongoose";
import User from "../models/UserModel.js";
export const registerUser=async(req,res)=>{
    const{name,email,password,role}=req.body;
    try{
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }
        const newuser=new User({name,email,password,role});
        await newuser.save();
        res.status(201).json({message:"User registered successfully"});
    }
    catch(error){
        res.status(500).json({message:"Error registering user",error:error.message});
    }

}
