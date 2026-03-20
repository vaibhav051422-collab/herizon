import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { createServer } from 'http'; 
import { Server } from 'socket.io'; 
import userRoutes from './routes/UserRoutes.js';
import dashboardRoutes from './routes/DashboardRoutes.js'; 

const app = express();
const PORT = process.env.PORT 


app.use(cors({
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});


app.set('socketio', io); 


app.use('/auth', userRoutes);
app.use('/api', dashboardRoutes); 

app.get('/home', (req, res) => {
    res.send("MindBridge Backend is Operational.");
});


io.on("connection", (socket) => {
    console.log(" New Connection Established:", socket.id);

    
    socket.on("join-circle", (roomId) => {
        if (roomId) {
            socket.join(roomId);
            console.log(` User joined room: ${roomId}`);
        }
    });

   
    socket.on("send-sos", (data) => {
        // data: { circleId, userName, location }
        if (data && data.circleId) {
            socket.to(data.circleId).emit("receive-sos", {
                userName: data.userName || "User",
                location: data.location || "Unknown",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
            console.log(`🚨 SOS sent to circle: ${data.circleId} by ${data.userName}`);
        }
    });

    socket.on("disconnect", () => {
        console.log(" User disconnected:", socket.id);
    });
});


const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(" Database connected successfully");
        
        
        httpServer.listen(PORT, () => {
            console.log(` Server running on ${PORT}`);
        });
    } catch (error) {
        console.error(" Database Error:", error.message);
        process.exit(1);
    }
};

start();