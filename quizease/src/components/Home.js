import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();
    const [quizId, setQuizId] = useState("");

    return (
        <div className="home-container">
            <div className="card">
                <h2>Enter Quiz ID : 67b7cf5b0b567a06c364e125</h2>
                <input
                    type="text"
                    placeholder="Quiz ID"
                    value={quizId}
                    onChange={(e) => setQuizId(e.target.value)}
                />
                <button onClick={() => navigate(`/quiz/${quizId}`)}>Start Quiz</button>
            </div>
        </div>
    );
};

export default Home;
