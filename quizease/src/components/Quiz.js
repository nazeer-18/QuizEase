import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/Quiz.css";
import { getQuizData } from "../services/quizService";
import LeaderboardService from "../services/leaderboardService";

const Quiz = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [quizData, setQuizData] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [feedback, setFeedback] = useState(null);
    const [score, setScore] = useState(0);
    const [showMessage, setShowMessage] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitQuiz,setSubmitQuiz] = useState(false);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowMessage(true);
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        getQuizData(quizId)
            .then((data) => {
                if (data.error) {
                    setQuizData(null);
                } else {
                    setQuizData(data);
                }
            })
            .catch((error) => console.error(error));
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
                navigate("/", { replace: true });
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [quizData, navigate]);

    const handleAnswerSelect = (answer) => {
        if (!submitted) {
            setSelectedAnswers({ ...selectedAnswers, [currentQuestionIndex]: answer });
        }
    };

    const handleSubmitQuestion = () => {
        if (submitted || selectedAnswers[currentQuestionIndex] === undefined) return; // Prevent submission if no option is selected

        setSubmitted(true);
        const currentQuestion = quizData.questions[currentQuestionIndex];
        if (selectedAnswers[currentQuestionIndex] === currentQuestion.answer) {
            setFeedback({ message: "Hurray! Yes, you got it right!", correct: true });
            setScore(score + 1);
        } else {
            setFeedback({ message: `Oops! The correct answer is ${currentQuestion.answer}`, correct: false });
        }
        setTimeout(() => {
            setFeedback(null);
            setSubmitted(false);
            handleNext();
        }, 2000);
    };

    const handleNext = () => {
        if (currentQuestionIndex < quizData.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setTimeLeft(30);
            setSubmitted(false);
        }else{
            setSubmitQuiz(true);
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

    useEffect(() => {
        if (submitQuiz)
            handleSubmit();
    }, [score,submitQuiz])

    if (!quizData && showMessage) return <div className="quiz-error"> Sorry this Quiz does not exist :(</div>;

    if (!quizData) return <div>Loading...</div>;

    const currentQuestion = quizData.questions[currentQuestionIndex];

    return (
        <div className="quiz-container">
            <h3>{quizData.title}</h3>
            <h4>Score: {score}</h4>
            <div className="question-desc">
                <div>Question {currentQuestionIndex + 1}/{quizData.questions.length} </div>
                <div>Type: {currentQuestion.type}</div>
            </div>
            <div className="timer">Time Left: {timeLeft}s</div>
            <div className="question-box">
                <p>{currentQuestion.question}</p>

                {currentQuestion.type === "mcq" ? (
                    Object.keys(currentQuestion.options).map((key) => {
                        const isSelected = selectedAnswers[currentQuestionIndex] === key;
                        const isCorrect = key === currentQuestion.answer;
                        const isWrong = isSelected && !isCorrect;

                        return (
                            <button
                                key={key}
                                className={`option-button ${isSelected ? "selected" : ""} 
                                    ${submitted ? (isCorrect ? "correct" : isWrong ? "wrong" : "") : ""}`}
                                onClick={() => handleAnswerSelect(key)}
                                disabled={submitted}
                            >
                                {key}. {currentQuestion.options[key]}
                            </button>
                        );
                    })
                ) : (
                    <input
                        type="number"
                        value={selectedAnswers[currentQuestionIndex] || ""}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) {
                                handleAnswerSelect(Number(value));
                            }
                        }}
                        disabled={submitted}
                    />
                )}
            </div>

            {feedback && <p className={feedback.correct ? "correct" : "incorrect"}>{feedback.message}</p>}
            <div className="navigation">
                <button onClick={handleSubmitQuestion} disabled={submitted || selectedAnswers[currentQuestionIndex] === undefined}>
                    Submit Answer
                </button>
            </div>
        </div>
    );
};

export default Quiz;