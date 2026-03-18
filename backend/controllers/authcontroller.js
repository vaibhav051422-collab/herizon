import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'; // 🔥 Added for unique code generation
import User from '../models/UserModel.js';

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d', 
  });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Please provide name, email, and password." });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already registered." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 🔥 NEW: Mentor Code Generation Logic
    let mentorCode = null;
    if (role === 'mentor') {
      // Generates a code like MNT-A1B2
      mentorCode = `MNT-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
    }

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
      mentorCode, // 🔥 Saving the unique code
    });

    res.status(201).json({
      success: true,
      token: generateToken(newUser._id, newUser.role),
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        mentorCode: newUser.mentorCode // Sending it back so frontend can show it
      }
    });
  } catch (error) {
    console.error("REGISTRATION ERROR:", error);
    res.status(500).json({ success: false, message: "Registration failed." });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ success: false, message: "Please provide email, password, and select a role." });
    }

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      
      if (user.role !== role) {
        return res.status(403).json({ 
          success: false, 
          message: `Access Denied. You are registered as a '${user.role.toUpperCase()}', not a '${role.toUpperCase()}'.` 
        });
      }

      res.status(200).json({
        success: true,
        message: "Login successful",
        token: generateToken(user._id, user.role), 
        role: user.role, 
        name: user.name,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          mentorCode: user.mentorCode // 🔥 Ensuring Mentor gets their code on login
        }
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid email or password." });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Login failed." });
  }
};