import React from 'react';
import { NavLink } from 'react-router-dom';
import './RepresentativeNavbar.css'; // You’ll create this

import {
    FaHome,
    FaChartBar,
    FaUser
} from 'react-icons/fa';

const RepresentativeNavbar = () => {
    return (
        <nav className="representative-navbar">
            <ul className="nav-links">
                <li>
                    <NavLink to="/representative" className={({ isActive }) => isActive ? 'active' : ''}>
                        <FaUser /> User Management
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/representative/statistics" className={({ isActive }) => isActive ? 'active' : ''}>
                        <FaChartBar /> Statistics
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default RepresentativeNavbar;
