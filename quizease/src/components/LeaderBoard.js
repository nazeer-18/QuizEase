import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LeaderboardService from "../services/leaderboardService";
import "../styles/Leaderboard.css";

const Leaderboard = () => {
    const { quizId } = useParams();
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const data = await LeaderboardService.getLeaderboard(quizId);
                setLeaderboard(data.rankings);
                console.log(leaderboard);
                console.log(data.rankings);
            } catch (error) {
                console.error("Failed to fetch leaderboard");
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, [quizId]);

    return (
        <div className="leaderboard-container">
            <h2 className="leaderboard-title">🏆 Leaderboard</h2>

            {loading ? (
                <p className="loading-text">Loading...</p>
            ) : leaderboard.length === 0 ? (
                <p className="loading-text">No scores available yet.</p>
            ) : (
                <table className="leaderboard-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>User</th>
                            <th>Best Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboard
                            .sort((a, b) => b.maxScore - a.maxScore)
                            .map((entry, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{entry.user.name}</td>
                                    <td className="score">{entry.maxScore}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Leaderboard;
