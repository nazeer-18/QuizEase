import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/Quiz.css";
import { getQuizData } from "../services/quizService";
import LeaderboardService from "../services/leaderboardService";
import axios from "axios";

const Quiz = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [quizData, setQuizData] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30); // 30 seconds per question
    const [feedback, setFeedback] = useState(null);
    const [score, setScore] = useState(0);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        getQuizData(quizId).then((data) => {
            if (data.error) {
                setQuizData(null);
            } else {
                setQuizData(data);
            }
        }).catch((error) => console.error(error));
    }, [quizId]);


    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            handleSubmitQuestion();
        }
    }, [timeLeft]);

    useEffect(() => {
        if (!quizData) {
            const timer = setTimeout(() => {
                navigate("/", { replace: true }); // Replaces history entry
            }, 3000); // Redirects after 3 seconds

            return () => clearTimeout(timer);
        }
    }, [quizData, navigate]);

    if (!quizData) return <div className="quiz-error"> Sorry this Quiz does not exists:(</div>;

    const handleAnswerSelect = (answer) => {
        setSelectedAnswers({ ...selectedAnswers, [currentQuestionIndex]: answer });
    };

    const handleSubmitQuestion = () => {
        const currentQuestion = quizData.questions[currentQuestionIndex];
        if (selectedAnswers[currentQuestionIndex] === currentQuestion.answer) {
            setFeedback({ message: "Hurray! Yes, you got it right!", correct: true });
            setScore(score + 1);
        } else {
            setFeedback({ message: `Oops! The correct answer is ${currentQuestion.answer}`, correct: false });
        }
        setTimeout(() => {
            setFeedback(null);
            handleNext();
        }, 2000);
    };

    const handleNext = () => {
        if (currentQuestionIndex < quizData.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setTimeLeft(30);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        try {
            await LeaderboardService.updateLeaderboard(quizId, userId, score);
            navigate(`/leaderboard/${quizId}`, { replace: true });
        } catch (error) {
            console.error("Failed to update leaderboard");
        }
    };

    if (!quizData) return <div>Loading...</div>;

    const currentQuestion = quizData.questions[currentQuestionIndex];

    return (
        <div className="quiz-container">
            <h2>{quizData.title}</h2>
            <div className="question-desc">
                <div>Question {currentQuestionIndex + 1}/{quizData.questions.length} </div>
                <div>Type: {currentQuestion.type}</div>
            </div>
            <div className="timer">Time Left: {timeLeft}s</div>
            <div className="question-box">
                <p>{currentQuestion.question}</p>
                {currentQuestion.type === "mcq" ? (
                    Object.keys(currentQuestion.options).map((key) => (
                        <button
                            key={key}
                            className={selectedAnswers[currentQuestionIndex] === key ? "selected" : ""}
                            onClick={() => handleAnswerSelect(key)}
                        >
                            {key}. {currentQuestion.options[key]}
                        </button>
                    ))
                ) : (
                    <input
                        type="number"
                        value={selectedAnswers[currentQuestionIndex] || ""}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) { // Allows only digits
                                handleAnswerSelect(Number(value));
                            }
                        }}
                    />
                )}
            </div>
            {feedback && <p className={feedback.correct ? "correct" : "incorrect"}>{feedback.message}</p>}
            <div className="navigation">
                <button onClick={handleSubmitQuestion}>Submit Answer</button>
            </div>
        </div>
    );
};

export default Quiz;
