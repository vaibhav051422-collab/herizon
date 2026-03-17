import mongoose from 'mongoose';

const circleSchema = new mongoose.Schema({
    motherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    inviteCode: { 
        type: String, 
        unique: true, 
        default: () => Math.random().toString(36).substring(2, 8).toUpperCase() 
    },
    guardianIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Circle', circleSchema);