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

 
  dependents: [{
    name: String,
    age: Number,
    schoolName: String,
    pickupDetails: String
  }],
  trustedGuardians: [{
    name: String,
    relation: String, 
    phone: String,
    isEmergencyContact: { type: Boolean, default: false }
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
  },

  createdAt: { type: Date, default: Date.now },
  lastActive: { type: Date }
}, {
 
  timestamps: true 
});

const User = mongoose.model('User', userSchema);
export default User;