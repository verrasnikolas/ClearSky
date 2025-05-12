import React from 'react';
import { NavLink } from 'react-router-dom';
import './StudentNavbar.css'; // Create this CSS file

const StudentNavbar = () => {
    return (
        <nav className="student-navbar">
            <ul className="nav-links">
                <li><NavLink to="/student/studentpage" activeclassname="active">My Courses</NavLink></li>
                <li><NavLink to="/student/statistics" activeclassname="active">Statistics</NavLink></li>
                <li><NavLink to="/student/grades" activeclassname="active">My Grades</NavLink></li>
                <li><NavLink to="/student/review-request" activeclassname="active">Request Review</NavLink></li>
                <li><NavLink to="/student/review-status" activeclassname="active">Review Status</NavLink></li>
            </ul>
        </nav>
    );
};

export default StudentNavbar;
