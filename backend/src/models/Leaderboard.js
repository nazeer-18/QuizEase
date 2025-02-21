const mongoose = require("mongoose");

const leaderboardSchema = new mongoose.Schema({
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
        required: true
    },
    rankings: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            scores: [{ type: Number, required: true }],  // Stores all past scores
            maxScore: { type: Number, default: 0 }  // Auto-updated highest score
        }
    ]
});

// Middleware to update maxScore before saving
leaderboardSchema.pre("save", function (next) {
    this.rankings.forEach(entry => {
        entry.maxScore = Math.max(...entry.scores);  // Update maxScore
    });
    next();
});

module.exports = mongoose.model("Leaderboard", leaderboardSchema);