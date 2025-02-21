const express = require("express");
const Quiz = require("../models/Quiz");
const Question = require("../models/Question");

const router = express.Router();

router.post("/add-questions", async (req, res) => {
    try {
        //we are sending quiz id and questions array
        const { quizId, questions } = req.body;
        if (!quizId || !Array.isArray(questions)) {
            return res.status(400).json({ message: "Invalid request data" });
        }

        let quiz = await Quiz.findById(quizId);
        if (!quiz) return res.status(404).json({ message: "Quiz not found" });

        const newQuestions = await Question.insertMany(questions);

        // Extract the question IDs and add them to quiz
        const questionIds = newQuestions.map(q => q._id);
        quiz.questions.push(...questionIds);

        await quiz.save();
        res.json({ message: "Questions added successfully", quiz });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;