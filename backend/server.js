import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
const app =express();
import mongoose from 'mongoose';
const PORT=4001;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config();
app.use(cors());
app.get('/home',(req,res)=>{
    res.send("backend is fucking working")
})
const start=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);

    }
    catch{
        console.log("Error connecting to database");

    }
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`)
    })
}
start();

