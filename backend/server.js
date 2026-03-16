import dotenv from 'dotenv';

dotenv.config(); 

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import userRoutes from './routes/UserRoutes.js';

const app = express();
const PORT = process.env.PORT || 4001;


app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));


app.use('/auth', userRoutes);

app.get('/home', (req, res) => {
    res.send("Backend is working perfectly.");
});
// app.get('/login', (req, res) => {
//     res.send("Login page");
// });

const start = async () => {
    try {
       
        await mongoose.connect(process.env.MONGO_URI);
        console.log(" Database connected successfully");
        
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error(" Error connecting to database:", error.message);
        process.exit(1); 
    }
};

start();