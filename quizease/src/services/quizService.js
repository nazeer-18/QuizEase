import axios from "axios";

const API_URL = process.env.SERVER_URL || 'http://localhost:8080';
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