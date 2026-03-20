import express from 'express';
import User from '../models/UserModel.js'; 
import Circle from '../models/Circle.js';
import Task from '../models/Task.js'; 
import authMiddleware from '../middleware/authMiddleware.js'; 

const router = express.Router();

router.get('/dashboard/init', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;

        let user = await User.findById(userId)
            .populate('circleId')
            .populate('assignedMentorId');

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
            userId: user._id,
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

router.get('/mentor/mentees', authMiddleware, async (req, res) => {
    try {
        const mentorId = req.user.id;

        const mentees = await User.find({
            assignedMentorId: mentorId,
            _id: { $ne: mentorId }
        })
        .select('name email isOnline lastSeen circleId')
        .sort({ createdAt: -1 });

        res.json(mentees);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/mentor/send-vc-link', authMiddleware, async (req, res) => {
    try {
        const { menteeId, meetLink } = req.body;

        if (!menteeId || !meetLink) {
            return res.status(400).json({ message: "Mentee ID & Link required" });
        }

        const mentor = await User.findById(req.user.id);
        const mentorName = mentor?.name || "Mentor";

        const io = req.app.get('socketio');

        if (!io) {
            return res.status(500).json({ message: "Socket error" });
        }

        io.to(menteeId.toString()).emit("receive-vc-link", {
            mentorName,
            meetLink,
            message: `${mentorName} started VC`
        });

        res.json({ success: true });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/mentor/connect', authMiddleware, async (req, res) => {
    try {
        const { mentorCodePaste } = req.body;

        const mentor = await User.findOne({
            role: 'mentor',
            mentorCode: mentorCodePaste.trim()
        });

        if (!mentor) {
            return res.status(400).json({ message: "Invalid code" });
        }

        if (mentor._id.toString() === req.user.id) {
            return res.status(400).json({ message: "Self connect not allowed" });
        }

        await User.findByIdAndUpdate(req.user.id, {
            assignedMentorId: mentor._id
        });

        const io = req.app.get('socketio');
        if (io) {
            io.to(mentor._id.toString()).emit("new-mentee-request", {
                menteeName: req.user.name,
                menteeId: req.user.id
            });
        }

        res.json({ success: true, mentorName: mentor.name });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/tasks/:circleId', authMiddleware, async (req, res) => {
    try {


        // For users, filter out accepted and completed tasks, but NOT declined
        let statusFilter = ['completed', 'accepted'];
        const tasks = await Task.find({
            circleId: req.params.circleId,
            removedByUser: { $ne: true },
            status: { $nin: statusFilter }
        }).sort({ createdAt: -1 });

        res.json(tasks);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/tasks/create', authMiddleware, async (req, res) => {
    try {
        const { title, time, date, circleId, type } = req.body;

        const user = await User.findById(req.user.id);

        const newTask = new Task({
            title,
            time,
            date,
            circleId,
            type: type || 'coordination',
            requestedBy: req.user.id,
            status: 'pending'
        });

        await newTask.save();

        const io = req.app.get('socketio');

        if (type === 'mentor_vc' && user.assignedMentorId) {
            io?.to(user.assignedMentorId.toString()).emit("new-help-alert", {
                ...newTask._doc,
                userName: user.name
            });
        } else {
            io?.to(circleId.toString()).emit("new-task-alert", newTask);
        }

        res.json({ success: true, task: newTask });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/task/action', authMiddleware, async (req, res) => {
    try {
        const { taskId, action } = req.body;

        const task = await Task.findById(taskId).populate('requestedBy');

        if (!task) return res.status(404).json({ message: "Task not found" });



        if (action === 'accepted') {
            task.status = 'accepted';
            task.assignedTo = req.user.id;
        } else if (action === 'completed') {
            task.status = 'completed';
        } else if (action === 'decline' || action === 'declined') {
            task.status = 'declined';
        } else {
            return res.status(400).json({ message: "Invalid action" });
        }

        await task.save();

        const io = req.app.get('socketio');
        let statusToEmit = (action === 'decline' || action === 'declined') ? 'declined' : action;
        let messageToEmit = (statusToEmit === 'declined') ? `Task declined: ${task.title}` : `Task ${statusToEmit}: ${task.title}`;
        io?.to(task.requestedBy._id.toString()).emit("task-update", {
            message: messageToEmit,
            status: statusToEmit,
            task
        });

        res.json({ success: true, task });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/task/complete-vc', authMiddleware, async (req, res) => {
    try {
        const { taskId } = req.body;

        const task = await Task.findById(taskId);

        if (!task) return res.status(404).json({ message: "Task not found" });

        if (task.type !== 'mentor_vc') {
            return res.status(400).json({ message: "Not VC task" });
        }

        if (task.assignedTo?.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not allowed" });
        }

        task.status = 'completed';
        await task.save();

        const io = req.app.get('socketio');

        io?.to(task.circleId.toString()).emit("task-update", {
            message: `VC completed: ${task.title}`,
            task
        });

        res.json({ success: true, task });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/tasks/:taskId', authMiddleware, async (req, res) => {
    try {
        const { taskId } = req.params;
        const userId = req.user.id;

        const task = await Task.findById(taskId);

        if (!task) return res.status(404).json({ message: "Task not found" });

        if (task.requestedBy.toString() !== userId) {
            return res.status(403).json({ message: "Not allowed" });
        }

        task.removedByUser = true;
        await task.save();

        const io = req.app.get('socketio');

        if (io && task.circleId) {
            io.to(task.circleId.toString()).emit("task-update", {
                message: `Task removed: ${task.title}`,
                status: 'removed',
                task
            });
        }

        res.json({ success: true });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/availability', authMiddleware, async (req, res) => {
    try {
        const { isOnline } = req.body;

        await User.findByIdAndUpdate(req.user.id, { isOnline });

        req.app.get('socketio')?.emit("user-status-change", {
            userId: req.user.id,
            isOnline
        });

        res.json({ success: true });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/circle/join', authMiddleware, async (req, res) => {
    try {
        const circle = await Circle.findOne({
            inviteCode: req.body.inviteCode.trim().toUpperCase()
        });

        if (!circle) return res.status(400).json({ message: "Invalid code" });

        await User.findByIdAndUpdate(req.user.id, {
            circleId: circle._id
        });

        res.json({ success: true, circleId: circle._id });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/circle/leave', authMiddleware, async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user.id, { circleId: null });

        res.json({ success: true });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;