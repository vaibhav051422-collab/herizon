import express from 'express';
import User from '../models/UserModel.js'; 
import Circle from '../models/Circle.js';
import Task from '../models/Task.js'; 
import authMiddleware from '../middleware/authMiddleware.js'; 

const router = express.Router();

// 1. DASHBOARD INITIALIZATION
// Provides user role, circle status, and invite codes
router.get('/dashboard/init', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        let user = await User.findById(userId).populate('circleId');
        if (!user) return res.status(404).json({ message: "User not found" });

        // Auto-create circle for 'user' role if they don't have one
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
            isOnline: user.isOnline || false, 
            circleId: user.circleId ? user.circleId._id : null,
            inviteCode: user.circleId ? user.circleId.inviteCode : "NOCODE"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. GET TASKS
// Fetches pending tasks for the circle or tasks assigned to the current Guardian
router.get('/tasks/:circleId', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const tasks = await Task.find({ 
            circleId: req.params.circleId,
            $or: [
                { status: 'pending' },
                { status: 'accepted', assignedTo: userId }
            ]
        }).sort({ createdAt: -1 });
        
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. TASK CREATE (User/Mother Side)
router.post('/tasks/create', authMiddleware, async (req, res) => {
    try {
        const { title, time, date, circleId, type } = req.body;
        const newTask = new Task({
            title, 
            time, 
            date, 
            circleId,
            type: type || 'coordination', // Distinguishes between normal tasks and mentor_vc
            requestedBy: req.user.id,
            status: 'pending'
        });
        await newTask.save();
        
        const io = req.app.get('socketio');
        if (io) io.to(circleId).emit("new-task-alert", newTask);

        res.json({ success: true, task: newTask });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. TASK ACTION (Accept/Complete/Decline)
router.post('/task/action', authMiddleware, async (req, res) => {
    try {
        const { taskId, action } = req.body; 
        const guardianId = req.user.id;
        const guardianName = req.user.name || "Guardian"; 

        const task = await Task.findById(taskId).populate('requestedBy');
        if (!task) return res.status(404).json({ success: false, message: "Task not found" });

        if (action === 'accepted') {
            task.status = 'accepted';
            task.assignedTo = guardianId;
        } else if (action === 'completed') {
            task.status = 'completed';
        } else {
            return res.status(400).json({ success: false, message: "Invalid action" });
        }

        await task.save();

        // Socket notification to the person who requested the task
        const io = req.app.get('socketio');
        if (io && task.requestedBy) {
            const motherId = task.requestedBy._id.toString();
            const msg = action === 'accepted' 
                ? `${guardianName} has accepted: ${task.title}` 
                : `Task Finished: ${task.title} ✅`;
            
            io.to(motherId).emit("task-update", {
                message: msg,
                status: action,
                task: task
            });
        }

        return res.json({ success: true, message: `Task ${action} successfully`, task });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 5. UPDATE AVAILABILITY
router.post('/availability', authMiddleware, async (req, res) => {
    try {
        const { isOnline } = req.body;
        await User.findByIdAndUpdate(req.user.id, { isOnline });
        res.json({ success: true, isOnline });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 6. JOIN CIRCLE (Link Unit)
router.post('/circle/join', authMiddleware, async (req, res) => {
    try {
        const { inviteCode } = req.body;
        const circle = await Circle.findOne({ inviteCode: inviteCode.trim().toUpperCase() });
        if (!circle) return res.status(400).json({ message: "Invalid Invite Code" });

        await User.findByIdAndUpdate(req.user.id, { circleId: circle._id });
        
        // Add Guardian to the circle's member list
        if (req.user.role === 'guardian') {
            await Circle.findByIdAndUpdate(circle._id, { $addToSet: { guardianIds: req.user.id } });
        }
        res.json({ message: "Joined successfully", circleId: circle._id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 7. UNLINK / LEAVE CIRCLE (The Mission Reset)
router.post('/circle/leave', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const oldCircleId = user.circleId;

        // Reset circle reference on User model
        user.circleId = null;
        await user.save();

        // Remove Guardian from the circle's tracking array
        if (user.role === 'guardian' && oldCircleId) {
            await Circle.findByIdAndUpdate(oldCircleId, { 
                $pull: { guardianIds: userId } 
            });
        }

        res.json({ success: true, message: "Unit unlinked successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;