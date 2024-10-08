const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = 'yourSecretKey';  // You should store this in an environment variable in a real app

// Register a shop owner
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists',status:0 });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: 'shopOwner',
    });

    await user.save();

    res.json({ message: "User Registered Successfully", status: 1 });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid email or password', status:0 });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid email or password', status:0 });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      status:1
    });
  } catch (err) {
    res.status(500).json({ msg: err.message,status:0 });
  }
});



module.exports = router;
