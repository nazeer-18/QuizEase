import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserQuizAttempts } from "../services/quizService";

const Home = () => {
    const navigate = useNavigate();
    const [attempts, setAttempts] = useState([]);
    const userId = localStorage.getItem("userId");
    const [quizId, setQuizId] = useState("67b7cf5b0b567a06c364e125");

    useEffect(() => {
        const fetchAttempts = async () => {
            if (userId && quizId) {
                const data = await getUserQuizAttempts(userId, quizId);
                setAttempts(data);
            }
        };
        fetchAttempts();
    }, [userId, quizId]);

    return (
        <div className="home-container">
            <div className="card">
                <h2>Enter Quiz ID</h2>
                <input
                    type="text"
                    placeholder="Quiz ID"
                    value={quizId}
                    onChange={(e) => setQuizId(e.target.value)}
                />
                <button onClick={() => navigate(`/quiz/${quizId}`)}>Start Quiz</button>
                <button onClick={() => navigate(`/leaderboard/${quizId}`)}>View Leaderboard</button>
            </div>
            {attempts.length > 0 && (
                <div className="attempt-history">
                    <h3>You have attempted this quiz {attempts.length} times:</h3>
                    <table className="leaderboard-table">
                        <thead>
                            <tr>
                                <th>Number</th>
                                <th>Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attempts.map((attempt, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{attempt}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Home;
