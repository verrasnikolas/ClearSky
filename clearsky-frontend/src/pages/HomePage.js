import React from 'react';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';

const HomePage = () => {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Welcome to clearSKY</h1>
            <p className={styles.subtitle}>Choose your role:</p>
            <ul className={styles.links}>
                <li className={styles.linkItem}><Link to="/student">Student</Link></li>
                <li className={styles.linkItem}><Link to="/instructor">Instructor</Link></li>
            </ul>
        </div>
    );
};

export default HomePage;
