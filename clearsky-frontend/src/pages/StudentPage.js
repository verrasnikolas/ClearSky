import React from 'react';
import ReviewForm from '../components/ReviewForm';
import styles from './StudentPage.module.css';

const StudentPage = () => {
    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Submit a Grade Review</h2>
            <ReviewForm />
        </div>
    );
};

export default StudentPage;
