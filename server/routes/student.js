const express = require('express');
const router = express.Router();
const SurveyResponse = require('../models/SurveyResponse');
const { protect, authorize } = require('../middleware/auth');

// @desc    Submit Survey
// @route   POST /api/student/survey
// @access  Private/Student
router.post('/survey', protect, authorize('STUDENT'), async (req, res) => {
    const { answers } = req.body;

    // Calculate score logic (simple average of values for now, assuming 1-5 scale)
    // Adjust based on actual survey logic requirement
    let score = 0;
    const values = Object.values(answers);
    if (values.length > 0) {
        const sum = values.reduce((acc, curr) => acc + Number(curr), 0);
        score = (sum / values.length).toFixed(1);
    }

    try {
        // Check if already submitted
        const existingSurvey = await SurveyResponse.findOne({ student: req.user.id });
        if (existingSurvey) {
            // Update existing or block? Requirement usually implies one submission, but let's allow update for now or block.
            // Let's block to keep it simple as "already submitted"
            return res.status(400).json({ message: 'Survey already submitted' });
        }

        const newSurvey = new SurveyResponse({
            student: req.user.id,
            score,
            answers
        });

        await newSurvey.save();

        res.json(newSurvey);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @desc    Get My Survey Results
// @route   GET /api/student/survey
// @access  Private/Student
router.get('/survey', protect, authorize('STUDENT'), async (req, res) => {
    try {
        const survey = await SurveyResponse.findOne({ student: req.user.id });
        if (!survey) {
            return res.status(404).json({ message: 'No survey found' });
        }
        res.json(survey);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
