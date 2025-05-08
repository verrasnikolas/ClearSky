import React from 'react';
import ReviewList from '../components/ReviewList';
import styles from './InstructorPage.module.css';

const InstructorPage = () => {
    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Pending Review Requests</h2>
            <ReviewList />
        </div>
    );
};

export default InstructorPage;
