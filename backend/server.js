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
const PORT = process.env.PORT || 5000;

// --- SOCKET.IO SETUP ---
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

// 🔥 CRITICAL: This line allows DashboardRoutes.js to use 'io' via req.app.get('socketio')
app.set('socketio', io); 

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- ROUTES ---
app.use('/auth', userRoutes);
app.use('/api', dashboardRoutes); 

app.get('/home', (req, res) => {
    res.send("Backend is working perfectly with Real-time Support.");
});

// --- SOCKET.IO LOGIC ---
io.on("connection", (socket) => {
    console.log("New Connection Established:", socket.id);

    // 1. Join Room: Mandatory for Mentor/Guardian to receive private alerts
    socket.on("join-circle", (circleId) => {
        if (circleId) {
            socket.join(circleId);
            console.log(`User ${socket.id} joined room/circle: ${circleId}`);
        }
    });

    // 2. MENTOR VC REQUEST LOGIC (Triggered from Socket)
    socket.on("mentor-help-request", (data) => {
        console.log(`VC Signal from ${data.userName} for Circle: ${data.circleId}`);
        
        if (!data.circleId) {
            console.error("Error: CircleID missing in socket event!");
            return;
        }

        // Broadcast to everyone in the circle (Guardian + Mentor)
        io.to(data.circleId).emit("new-help-alert", {
            _id: Date.now().toString(),
            title: `${data.userName} is asking for a VC`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: "mentor_vc",
            circleId: data.circleId,
            userName: data.userName
        });
    });

    // 3. EMERGENCY SOS LOGIC
    socket.on("send-sos", (data) => {
        io.to(data.circleId).emit("receive-sos", {
            message: `EMERGENCY: SOS triggered by ${data.userName}`,
            userName: data.userName,
            location: data.location,
            timestamp: new Date()
        });
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// --- DATABASE & SERVER START ---
const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(" Database connected successfully");
        
        httpServer.listen(PORT, () => {
            console.log(` Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Database Error:", error.message);
        process.exit(1);
    }
};

start();