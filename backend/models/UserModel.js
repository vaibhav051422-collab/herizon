import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['user', 'guardian', 'mentor'], 
    default: 'user' 
  },
  // 🔥 Iske bina connection nahi banega
  circleId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Circle', 
    default: null 
  },
  dependents: [{
    name: String,
    age: Number,
    schoolName: String,
    pickupDetails: String
  }],
  wellbeingLogs: [{
    mood: { type: String, enum: ['Happy', 'Stressed', 'Anxious', 'Balanced', 'Overwhelmed'] },
    stressLevel: { type: Number, min: 1, max: 10 },
    timestamp: { type: Date, default: Date.now }
  }],
  financeSummary: {
    monthlyIncome: { type: Number, default: 0 },
    fixedExpenses: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' }
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;