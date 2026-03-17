import express from 'express';
import User from '../models/UserModel.js'; 
import Circle from '../models/Circle.js';
import authMiddleware from '../middleware/authMiddleware.js'; 

const router = express.Router();

// 1. DASHBOARD INITIALIZATION
router.get('/dashboard/init', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        let user = await User.findById(userId).populate('circleId');
        
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.role === 'user' && !user.circleId) {
            let existingCircle = await Circle.findOne({ motherId: user._id });
            
            if (!existingCircle) {
                existingCircle = new Circle({ motherId: user._id });
                await existingCircle.save();
            }
            
            user.circleId = existingCircle._id;
            await user.save();
            user = await User.findById(userId).populate('circleId');
        }

        res.json({
            userName: user.name,
            role: user.role,
            isOnline: user.isOnline || false, // 👈 New field
            circleId: user.circleId ? user.circleId._id : null,
            inviteCode: user.circleId ? user.circleId.inviteCode : "NOCODE"
        });
    } catch (error) {
        console.error("🔥 Init Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// 2. JOIN CIRCLE
router.post('/circle/join', authMiddleware, async (req, res) => {
    try {
        const { inviteCode } = req.body;
        if (!inviteCode) return res.status(400).json({ message: "Please enter a code" });

        const cleanCode = inviteCode.trim().toUpperCase();
        const circle = await Circle.findOne({ inviteCode: cleanCode });

        if (!circle) return res.status(400).json({ message: "Invalid Invite Code" });

        await User.findByIdAndUpdate(req.user.id, { circleId: circle._id });

        if (req.user.role === 'guardian') {
            const isAlreadyAdded = circle.guardianIds.some(id => id.toString() === req.user.id.toString());
            if (!isAlreadyAdded) {
                circle.guardianIds.push(req.user.id);
                await circle.save();
            }
        }
        res.json({ message: "Joined successfully", circleId: circle._id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. UPDATE AVAILABILITY (Toggle Online/Standby) 🛡️
router.post('/availability', authMiddleware, async (req, res) => {
    try {
        const { isOnline } = req.body;
        await User.findByIdAndUpdate(req.user.id, { isOnline });
        res.json({ success: true, isOnline });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. TASK ACTION (Accept/Decline Logic) 📋
router.post('/task/action', authMiddleware, async (req, res) => {
    try {
        const { taskId, action } = req.body; // action: 'Accept' or 'Decline'
        
        // Log locally for now, later you can add a Task collection
        console.log(`User ${req.user.id} ${action}ed task ${taskId}`);
        
        res.json({ 
            success: true, 
            message: `Task ${action}ed successfully` 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;