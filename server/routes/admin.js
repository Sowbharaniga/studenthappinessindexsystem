const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Department = require('../models/Department');
const SurveyResponse = require('../models/SurveyResponse');
const { protect, authorize } = require('../middleware/auth');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
// @access  Private/Admin
router.get('/stats', protect, authorize('ADMIN'), async (req, res) => {
    try {
        const studentCount = await User.countDocuments({ role: 'STUDENT' });
        const departmentCount = await Department.countDocuments();

        // Calculate average happiness score
        const surveys = await SurveyResponse.find();
        const totalScore = surveys.reduce((acc, curr) => acc + curr.score, 0);
        const averageHappiness = surveys.length > 0 ? (totalScore / surveys.length).toFixed(1) : 0;

        // Get recent activity (latest surveys)
        const recentSurveys = await SurveyResponse.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('student', 'name department')
            .populate({
                path: 'student',
                populate: { path: 'department', select: 'name' }
            });

        const recentActivity = recentSurveys.map(survey => ({
            id: survey._id,
            studentName: survey.student ? survey.student.name : 'Unknown',
            score: survey.score,
            department: survey.student && survey.student.department ? survey.student.department.name : 'N/A',
            date: survey.createdAt
        }));

        res.json({
            studentCount,
            departmentCount,
            averageHappiness,
            recentActivity
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @desc    Get All Students
// @route   GET /api/admin/students
// @access  Private/Admin
router.get('/students', protect, authorize('ADMIN'), async (req, res) => {
    try {
        const students = await User.find({ role: 'STUDENT' })
            .select('-password')
            .populate('department', 'name')
            .sort({ createdAt: -1 });

        res.json(students);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @desc    Delete Student
// @route   DELETE /api/admin/students/:id
// @access  Private/Admin
router.delete('/students/:id', protect, authorize('ADMIN'), async (req, res) => {
    try {
        const student = await User.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Also delete their survey responses
        await SurveyResponse.deleteMany({ student: student._id });
        await student.deleteOne();

        res.json({ message: 'Student removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
