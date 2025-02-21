import axios from "axios";

const API_URL = "http://localhost:8080"; // Update if needed

const authService = {
    login: async (credentials) => {
        try {
            const res = await axios.post(`${API_URL}/api/authRoute/login`, credentials);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("userId", res.data.userId);
            return res.data;
        } catch (err) {
            console.error("Login Error:", err.response?.data?.message || err.message);
            throw err.response?.data || { message: "Login failed" };
        }
    },

    register: async (userData) => {
        try {
            const res = await axios.post(`${API_URL}/api/authRoute/register`, userData);
            return res.data;
        } catch (err) {
            console.error("Registration Error:", err.response?.data?.message || err.message);
            throw err.response?.data || { message: "Registration failed" };
        }
    },

    logout: () => {
        localStorage.removeItem("token");
    },

    isAuthenticated: () => {
        return !!localStorage.getItem("token");
    }
};

export default authService;
