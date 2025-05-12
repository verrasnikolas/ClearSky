import React from 'react';
import ReviewForm from '../../components/ReviewForm';
import styles from './StudentPage.module.css';
import StudentNavbar from './StudentNavbar'; // Make sure path is correct

const StudentPage = () => {
    return (
        <>
            <StudentNavbar />
            <div className={styles.container}>
                <h2 className={styles.heading}>Submit a Grade Review</h2>
                <ReviewForm />
            </div>
        </>
    );
};

export default StudentPage;
