import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>clearSKY</div>
            <ul className={styles.links}>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/student">Student</Link></li>
                <li><Link to="/instructor">Instructor</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;

