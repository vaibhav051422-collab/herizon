import express from 'express';
import User from '../models/UserModel.js'; 
import Circle from '../models/Circle.js';
import Task from '../models/Task.js'; 
import authMiddleware from '../middleware/authMiddleware.js'; 

const router = express.Router();


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
        const mentorName = req.user.name;

        if (!menteeId || !meetLink) {
            return res.status(400).json({ success: false, message: "Mentee ID and Link are required" });
        }

        const io = req.app.get('socketio');
        if (!io) {
            console.error(" SOCKET INSTANCE NOT FOUND");
            return res.status(500).json({ success: false, message: "Socket Instance Error" });
        }

       
        const roomPath = menteeId.toString();
        console.log(` Transmitting Bridge: ${mentorName} -> Mentee Room ${roomPath}`);

        io.to(roomPath).emit("receive-vc-link", {
            mentorName,
            meetLink,
            message: `${mentorName.toUpperCase()} has initiated a secure session.`
        });

        res.json({ success: true, message: "Link transmitted successfully!" });
    } catch (error) {
        console.error(" Send Link Error:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// 4. CONNECT TO MENTOR
router.post('/mentor/connect', authMiddleware, async (req, res) => {
    try {
        const { mentorCodePaste } = req.body;
        const userId = req.user.id;

        const mentor = await User.findOne({ role: 'mentor', mentorCode: mentorCodePaste.trim() });
        
        if (!mentor) {
            return res.status(400).json({ success: false, message: "Invalid Mentor Code." });
        }

        if (mentor._id.toString() === userId) {
            return res.status(400).json({ success: false, message: "Self-connection blocked." });
        }

        await User.findByIdAndUpdate(userId, { assignedMentorId: mentor._id });

        const io = req.app.get('socketio');
        if (io) {
            io.to(mentor._id.toString()).emit("new-mentee-request", {
                menteeName: req.user.name,
                menteeId: userId
            });
        }

        res.json({ success: true, message: "Connected!", mentorName: mentor.name });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 5. GET TASKS 
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


router.post('/tasks/create', authMiddleware, async (req, res) => {
    try {
        const { title, time, date, circleId, type } = req.body;
        const user = await User.findById(req.user.id); 
        
        if (!user) return res.status(404).json({ message: "User not found" });

        const newTask = new Task({
            title, time, date, circleId,
            type: type || 'coordination', 
            requestedBy: req.user.id,
            status: 'pending'
        });
        await newTask.save();
        
        const io = req.app.get('socketio');
        if (type === 'mentor_vc' && user.assignedMentorId) {
            if (io) {
                const mentorRoom = user.assignedMentorId.toString();
                console.log(`📡 Alerting Mentor Room: ${mentorRoom} from Mentee: ${user.name}`);
                
                io.to(mentorRoom).emit("new-help-alert", {
                    ...newTask._doc,
                    userName: user.name 
                });
            }
        } else {
            if (io && circleId) io.to(circleId.toString()).emit("new-task-alert", newTask);
        }

        res.json({ success: true, task: newTask });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 7. TASK ACTION 
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

// 8. UPDATE AVAILABILITY
router.post('/availability', authMiddleware, async (req, res) => {
    try {
        const { isOnline } = req.body;
        const userId = req.user.id;
        await User.findByIdAndUpdate(userId, { isOnline });
        const io = req.app.get('socketio');
        if (io) {
            io.emit("user-status-change", { userId, isOnline });
        }
        res.json({ success: true, isOnline });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 9. JOIN CIRCLE
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

export default router;