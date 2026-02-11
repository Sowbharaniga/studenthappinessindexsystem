const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Department = require('../models/Department');
const { protect } = require('../middleware/auth');

// Register User
router.post('/register', async (req, res) => {
    const { username, password, name, departmentId } = req.body;

    try {
        // Check if user exists
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Find department if provided
        let department = null;
        if (departmentId) {
            // Assuming departmentId might be name or ID -> sticking to ID as per schema ref
            // But valid creation might need looking up if frontend sends name.
            // For now assume frontend sends a valid ObjectId or we look up by name if needed.
            // Given the previous Next.js implementation looked up by name, let's support that.
            const dept = await Department.findOne({ name: departmentId });
            if (dept) {
                department = dept._id;
            }
        }

        user = new User({
            username,
            password: hashedPassword,
            name,
            role: 'STUDENT',
            department
        });

        await user.save();

        // Create token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
                name: user.name,
                department: user.department
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Login User
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check for user
        const user = await User.findOne({ username }).populate('department');
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
                name: user.name,
                department: user.department ? user.department.name : null
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get Current User
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password').populate('department');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
