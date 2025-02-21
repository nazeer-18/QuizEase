const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Leaderboard = require("../models/Leaderboard");
const Quiz = require("../models/Quiz")

// update user's score in the leaderboard
router.post("/update-leaderboard", async (req, res) => {
    try {
        const { quizId, userId, score } = req.body;

        // Find user ID from email
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const quiz = await Quiz.findById(quizId);
        if (!quiz) return res.status(404).json({ message: "No Quiz Found!" });
        // Find the leaderboard for this quiz
        let leaderboard = await Leaderboard.findOne({ quiz: quizId });

        if (!leaderboard) {
            // Create a new leaderboard if it doesn't exist
            leaderboard = new Leaderboard({ quiz: quizId, rankings: [] });
        }

        // Find the user in the rankings
        const userRanking = leaderboard.rankings.find(entry => entry.user.toString() === user._id.toString());

        if (userRanking) {
            // User exists -> update their scores and maxScore
            userRanking.scores.push(score);
            userRanking.maxScore = Math.max(userRanking.maxScore, score);
        } else {
            // New user -> add to leaderboard
            leaderboard.rankings.push({
                user: user._id,
                scores: [score],
                maxScore: score
            });
        }

        // Save changes
        await leaderboard.save();
        res.status(200).json({ message: "Leaderboard updated successfully" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/get-leaderboard/:quizId", async (req, res) => {
    try {
        const { quizId } = req.params;

        const leaderboard = await Leaderboard.findOne({ quiz: quizId })
            .populate("rankings.user", "name email") // Populate user details
            .sort({ "rankings.maxScore": -1 }); // Sort by highest score

        if (!leaderboard) {
            return res.status(404).json({ message: "Leaderboard not found" });
        }
        res.status(200).json(leaderboard);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;