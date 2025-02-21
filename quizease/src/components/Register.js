import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import "../styles/Auth.css";

const Register = () => {
    const [user, setUser] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authService.register(user);

            setMessage("Registeration successful! Redirecting to Login page...");

            // Wait for 2 seconds before navigating to login
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            setError(err?.response?.data?.message || err.message || "Something went wrong");
        }
    };

    return (
        <div className="auth-container">
            <h2>Register</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Full Name" required onChange={handleChange} />
                <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
                <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
                <button type="submit">Register</button>
            </form>
            <p>Already have an account? <a href="/login">Login</a></p>
            {message && <p className="msg-success">{message}</p>}
        </div>
    );
};

export default Register;
