import express from 'express';
import User from '../models/UserModel.js'; 
import Circle from '../models/Circle.js';
import Task from '../models/Task.js'; 
import authMiddleware from '../middleware/authMiddleware.js'; 

const router = express.Router();

// 1. DASHBOARD INITIALIZATION
router.get('/dashboard/init', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        let user = await User.findById(userId).populate('circleId').populate('assignedMentorId');
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
            isOnline: user.isOnline || false, 
            circleId: user.circleId ? user.circleId._id : null,
            inviteCode: user.circleId ? user.circleId.inviteCode : "NOCODE",
            mentorCode: user.assignedMentorId ? user.assignedMentorId.mentorCode : null,
            myMentorCode: user.role === 'mentor' ? user.mentorCode : null
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🔥 CONNECT TO MENTOR
router.post('/mentor/connect', authMiddleware, async (req, res) => {
    try {
        const { mentorCodePaste } = req.body;
        const userId = req.user.id;

        const mentor = await User.findOne({ role: 'mentor', mentorCode: mentorCodePaste.trim() });
        
        if (!mentor) {
            return res.status(400).json({ success: false, message: "Invalid Mentor Code. Please check again." });
        }

        await User.findByIdAndUpdate(userId, { assignedMentorId: mentor._id });

        const io = req.app.get('socketio');
        if (io) {
            io.to(mentor._id.toString()).emit("new-mentee-request", {
                menteeName: req.user.name,
                menteeId: userId,
                message: `${req.user.name} has linked with your mentor code.`
            });
        }

        res.json({ 
            success: true, 
            message: "Connected to Mentor successfully!", 
            mentorName: mentor.name 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 2. GET TASKS 
router.get('/tasks/:circleId', authMiddleware, async (req, res) => {
    try {
        const tasks = await Task.find({ 
            circleId: req.params.circleId,
            $or: [
                { status: 'pending' },
                { status: 'accepted', assignedTo: req.user.id }
            ]
        }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. TASK CREATE 
router.post('/tasks/create', authMiddleware, async (req, res) => {
    try {
        const { title, time, date, circleId, type } = req.body;
        const user = await User.findById(req.user.id);
        
        const newTask = new Task({
            title, time, date, circleId,
            type: type || 'coordination', 
            requestedBy: req.user.id,
            status: 'pending'
        });
        await newTask.save();
        
        const io = req.app.get('socketio');
        if (type === 'mentor_vc' && user.assignedMentorId) {
            if (io) io.to(user.assignedMentorId.toString()).emit("new-help-alert", newTask);
        } else {
            if (io) io.to(circleId).emit("new-task-alert", newTask);
        }

        res.json({ success: true, task: newTask });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. TASK ACTION 
router.post('/task/action', authMiddleware, async (req, res) => {
    try {
        const { taskId, action } = req.body; 
        const task = await Task.findById(taskId).populate('requestedBy');
        if (!task) return res.status(404).json({ success: false, message: "Task not found" });

        if (action === 'accepted') {
            task.status = 'accepted';
            task.assignedTo = req.user.id;
        } else if (action === 'completed') {
            task.status = 'completed';
        } else {
            return res.status(400).json({ success: false, message: "Invalid action" });
        }

        await task.save();

        const io = req.app.get('socketio');
        if (io && task.requestedBy) {
            io.to(task.requestedBy._id.toString()).emit("task-update", {
                message: action === 'accepted' ? `${req.user.name} has accepted: ${task.title}` : `Task Finished: ${task.title}`,
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
        await User.findByIdAndUpdate(req.user.id, { isOnline: req.body.isOnline });
        res.json({ success: true, isOnline: req.body.isOnline });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 6. JOIN CIRCLE
router.post('/circle/join', authMiddleware, async (req, res) => {
    try {
        const { inviteCode } = req.body;
        const circle = await Circle.findOne({ inviteCode: inviteCode.trim().toUpperCase() });
        if (!circle) return res.status(400).json({ message: "Invalid Invite Code" });

        await User.findByIdAndUpdate(req.user.id, { circleId: circle._id });
        if (req.user.role === 'guardian') {
            await Circle.findByIdAndUpdate(circle._id, { $addToSet: { guardianIds: req.user.id } });
        }
        res.json({ message: "Joined successfully", circleId: circle._id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 7. LEAVE CIRCLE
router.post('/circle/leave', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const oldCircleId = user.circleId;
        user.circleId = null;
        await user.save();

        if (user.role === 'guardian' && oldCircleId) {
            await Circle.findByIdAndUpdate(oldCircleId, { $pull: { guardianIds: req.user.id } });
        }
        res.json({ success: true, message: "Unit unlinked successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;