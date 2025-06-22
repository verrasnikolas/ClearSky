import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaUpload, FaCheckCircle, FaChartBar, FaInbox } from 'react-icons/fa';
import styles from './InstructorNav.module.css';

const InstructorNav = () => {
    return (
        <nav className={styles.navbar}>
            <ul className={styles.navList}>
                <li>
                    <NavLink to="/instructor/upload" className={({ isActive }) => isActive ? styles.active : ''}>
                        <FaUpload /> Upload Initial Grades
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/instructor/reviews" className={({ isActive }) => isActive ? styles.active : ''}>
                        <FaInbox /> Review Requests
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/instructor/statistics" className={({ isActive }) => isActive ? styles.active : ''}>
                        <FaChartBar /> View Statistics
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/instructor/courses" className={({ isActive }) => isActive ? styles.active : ''}>
                        <FaChartBar /> My Graded Courses
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default InstructorNav;
