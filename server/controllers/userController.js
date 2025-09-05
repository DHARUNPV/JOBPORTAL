const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, username, email, password, role } = req.body;

    if (!name || !username || !email || !password || !role) {
      return res.status(400).send('All fields are required.');
    }

    const existingUsername = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });

    if (existingUsername) {
      return res.status(409).send('Username already exists.');
    }
    if (existingEmail) {
      return res.status(409).send('Email already registered.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
      role  // ✅ make sure role (seeker/employer) is saved
    });

    await newUser.save();
    res.status(201).send('User registered successfully!');
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).send('Internal Server Error');
  }
};

// ✅ Login with role included
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    // 🔑 Generate JWT with role inside
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      token: `Bearer ${token}`,
      userId: user._id,
      role: user.role,   // ✅ return role for frontend
      name: user.name    // ✅ keep name too
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerUser,
  loginUser
};
