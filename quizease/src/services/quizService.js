import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;
console.log(API_URL);

export const getQuizData = async (quizId) => {
    try {
        const response = await axios.get(`${API_URL}/api/quizRoute/give-quiz/${quizId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching quiz data", error);
        throw error;
    }
};

export const getUserQuizAttempts = async (userId, quizId) => {
    try {
        const response = await axios.get(`${API_URL}/api/quizRoute/user-attempts/${userId}/${quizId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user quiz attempts", error);
        return [];
    }
};
