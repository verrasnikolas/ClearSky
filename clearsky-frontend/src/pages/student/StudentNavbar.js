import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    FaBookOpen,
    FaChartBar,
    FaGraduationCap,
    FaClipboardCheck,
    FaRegCheckCircle
} from 'react-icons/fa';
import './StudentNavbar.css'; // CSS below

const StudentNavbar = () => {
    return (
        <nav className="student-navbar">
            <ul className="nav-links">
                <li>
                    <NavLink to="/student/studentpage" className={({ isActive }) => isActive ? 'active' : ''}>
                        <FaBookOpen /> My Courses
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/student/statistics" className={({ isActive }) => isActive ? 'active' : ''}>
                        <FaChartBar /> Statistics
                    </NavLink>
                </li>
                {/*<li>*/}
                {/*    <NavLink to="/student/grades" className={({ isActive }) => isActive ? 'active' : ''}>*/}
                {/*        <FaGraduationCap /> My Grades*/}
                {/*    </NavLink>*/}
                {/*</li>*/}
                {/*<li>*/}
                {/*    <NavLink to="/student/review-request" className={({ isActive }) => isActive ? 'active' : ''}>*/}
                {/*        <FaClipboardCheck /> Request Review*/}
                {/*    </NavLink>*/}
                {/*</li>*/}
                {/*<li>*/}
                {/*    <NavLink to="/student/review-status" className={({ isActive }) => isActive ? 'active' : ''}>*/}
                {/*        <FaRegCheckCircle /> Review Status*/}
                {/*    </NavLink>*/}
                {/*</li>*/}
            </ul>
        </nav>
    );
};

export default StudentNavbar;
