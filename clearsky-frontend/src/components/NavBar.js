import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import { userApi } from '../services/api'; // Import του userApi

const Navbar = ({ isLoggedIn, onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const refreshToken = localStorage.getItem('refreshToken'); // 👈 Λαμβάνουμε το refreshToken

        try {
            await userApi.post('/auth/logout', { refreshToken }); // 👈 Στέλνουμε το refreshToken στο body
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            onLogout();
            navigate('/login');
        } catch (error) {
            console.error('Error during logout:', error);
            // Μπορείς να εμφανίσεις ένα μήνυμα σφάλματος στον χρήστη
        }
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>clearSKY</div>
            <ul className={styles.links}>
                <li><Link to="/">Home</Link></li>
                {isLoggedIn && (
                    <>
                        <li><Link to="/student/statistics">Statistics</Link></li>
                        <li><Link to="/student/grades">My Grades</Link></li>
                        <li><Link to="/instructor">Instructor</Link></li>
                        <li><button onClick={handleLogout}>Logout</button></li>
                    </>
                )}
                {!isLoggedIn && (
                    <li><Link to="/login">Login</Link></li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;