const express = require("express");
const Quiz = require("../models/Quiz");

const router = express.Router();

router.post('/add-quiz', async (req, res) => {
    try {

        const { title, questions } = req.body;
        if (!title || title.trim() === "") {
            return res.status(400).json({ error: "Quiz title cannot be empty" });
        }

        const isExisting = await Quiz.findOne({ title });
        if (isExisting) {
            return res.status(400).json({ error: "A quiz with this title already exists" });
        }

        const newQuiz = new Quiz({
            title,
            attempts: [],
            questions: []
        })

        await newQuiz.save();
        res.json({ message: "Quiz added Successfully", newQuiz })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
})

router.get('/give-quiz/:quizId', async (req, res) => {
    try {
        const { quizId } = req.params;
        const quiz = await Quiz.findById(quizId).populate("questions");
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }
        res.json(quiz);
    } catch (error) {
        console.error("Error fetching quiz:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
})

module.exports = router;