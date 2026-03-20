import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: String,
    time: String,
    date: String,
    status: { type: String, enum: ['pending', 'accepted', 'completed', 'declined'], default: 'pending' },
    circleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Circle' },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, default: 'coordination' }, // e.g., 'coordination', 'mentor_vc'
    removedByUser: { type: Boolean, default: false } // true if user deleted the task
});

export default mongoose.model('Task', taskSchema);