import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import {authApi, userApi} from '../services/api'; // Import του userApi

const Navbar = ({ isLoggedIn, onLogout }) => {
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole');

    const handleLogout = async () => {
        const refreshToken = localStorage.getItem('refreshToken'); // 👈 Λαμβάνουμε το refreshToken

        try {
            await authApi.post('/logout', { refreshToken }); // 👈 Στέλνουμε το refreshToken στο body
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            onLogout();
            navigate('/login');
        } catch (error) {
            console.error('Error during logout:', error);
            // Μπορείς να εμφανίσεις ένα μήνυμα σφάλματος στον χρήστη
        }
    };

    const getHomeLink = () => {
        switch (userRole) {
            case 'instructor':
                return '/instructor/upload';
            case 'student':
                return '/student/studentpage';
            default:
                return '/';
        }
    };

    const handleHomeClick = () => {
        navigate(getHomeLink());
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>clearSKY</div>
            <ul className={styles.links}>
                {isLoggedIn && (
                    <>
                        <li>
                            <button onClick={handleHomeClick} className={styles.navButton}>
                                Home
                            </button>
                        </li>
                        <li>
                            <button onClick={handleLogout} className={styles.navButton}>
                                Logout
                            </button>
                        </li>
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