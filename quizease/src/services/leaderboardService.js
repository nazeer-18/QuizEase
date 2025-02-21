import axios from "axios";

const API_URL = "http://localhost:8080";

const LeaderboardService = {
    // Fetch leaderboard for a specific quiz
    getLeaderboard: async (quizId) => {
        try {
            const response = await axios.get(`${API_URL}/api/leaderboardRoute/get-leaderboard/${quizId}`);
            return response.data; // Returns leaderboard rankings
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
            throw error;
        }
    },

    // Update leaderboard (send score)
    updateLeaderboard: async (quizId, userId, score) => {
        try {
            const response = await axios.post(`${API_URL}/api/leaderboardRoute/update-leaderboard`, {
                quizId,
                userId,
                score
            });
            return response.data; // Returns updated leaderboard entry
        } catch (error) {
            console.error("Error updating leaderboard:", error);
            throw error;
        }
    }
};

export default LeaderboardService;