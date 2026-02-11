const mongoose = require('mongoose');

const surveyResponseSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    score: {
        type: Number,
        required: true
    },
    answers: {
        type: Object, // Storing JSON structure of answers
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('SurveyResponse', surveyResponseSchema);
