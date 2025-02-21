import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <nav className="navbar">
            <h1 className="logo">QuizEase</h1>
            <div className="profile" onClick={() => navigate("/profile")}>Profile</div>
        </nav>
    );
};

export default Navbar;
