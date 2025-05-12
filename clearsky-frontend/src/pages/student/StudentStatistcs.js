import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './StudentStatisticsPage.module.css';
import StudentNavbar from './StudentNavbar';

const StudentStatisticsPage = () => {
    const navigate = useNavigate();

    const handleGoToCourses = () => {
        navigate('/student/studentpage');
    };

    return (
        <>
            <StudentNavbar />
            <div className={styles.container}>
                <div className={styles.headerRow}>
                    <h2 className={styles.heading}>Available Course Statistics</h2>
                    <button className={styles.button} onClick={handleGoToCourses}>
                        Go to My Courses
                    </button>
                </div>

                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>Course Name</th>
                        <th>Exam Period</th>
                        <th>Initial Grades Submission</th>
                        <th>Final Grades Submission</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>Physics</td>
                        <td>Fall 2024</td>
                        <td>2025-02-22</td>
                        <td>2025-02-28</td>
                    </tr>
                    <tr>
                        <td>Software</td>
                        <td>Fall 2024</td>
                        <td>2025-02-01</td>
                        <td>2025-02-14</td>
                    </tr>
                    <tr>
                        <td>Mathematics</td>
                        <td>Fall 2024</td>
                        <td>2025-02-02</td>
                        <td>2025-02-14</td>
                    </tr>
                    </tbody>
                </table>

                <div className={styles.chartGrid}>
                    <div className={styles.chartBox}>📊 Physics - Total</div>
                    <div className={styles.chartBox}>📈 Q1</div>
                    <div className={styles.chartBox}>📉 Q2</div>
                    <div className={styles.chartBox}>📊 Q3</div>
                    <div className={styles.chartBox}>📈 Q4</div>
                </div>
            </div>
        </>
    );
};

export default StudentStatisticsPage;
