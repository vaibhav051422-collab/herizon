import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: String,
    time: String,
    date: String,
    status: { type: String, enum: ['pending', 'accepted', 'completed'], default: 'pending' },
    circleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Circle' },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

export default mongoose.model('Task', taskSchema);