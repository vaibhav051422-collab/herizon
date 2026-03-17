import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { createServer } from 'http'; // Required for Socket.io
import { Server } from 'socket.io'; // Real-time engine
import userRoutes from './routes/UserRoutes.js';
import dashboardRoutes from './routes/DashboardRoutes.js'; // Future routes

const app = express();
const PORT = process.env.PORT || 4001;

// --- SOCKET.IO SETUP ---
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/auth', userRoutes);
app.use('/api', dashboardRoutes); // Dashboards connectivity APIs

app.get('/home', (req, res) => {
    res.send("Backend is working perfectly with Real-time Support.");
});

// --- SOCKET.IO LOGIC (The Nervous System) ---
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Join a specific room based on CircleID
    socket.on("join-circle", (circleId) => {
        socket.join(circleId);
        console.log(`User joined circle: ${circleId}`);
    });


    socket.on("send-sos", (data) => {
        
        io.to(data.circleId).emit("receive-sos", {
            message: `EMERGENCY: SOS triggered by ${data.userName}`,
            location: data.location,
            timestamp: new Date()
        });
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(" Database connected successfully");
        
        // Use httpServer.listen instead of app.listen
        httpServer.listen(PORT, () => {
            console.log(` Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Error connecting to database:", error.message);
        process.exit(1);
    }
};

start();