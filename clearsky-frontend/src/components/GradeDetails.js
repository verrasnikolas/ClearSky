import React from 'react';
import styles from './GradeDetails.module.css';

const GradeDetails = ({ course }) => {
    if (!course) return null;

    const { name, term, grade, question_grades } = course;

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.title}>📘 Grade Details</h2>

            <div className={styles.infoGrid}>
                <div><strong>Course:</strong> {name}</div>
                <div><strong>Exam Period:</strong> {term}</div>
                <div><strong>Final Grade:</strong> <span className={styles.grade}>{grade}</span></div>
            </div>

            <h3 className={styles.subtitle}>📝 Question Breakdown</h3>
            <table className={styles.table}>
                <thead>
                <tr>
                    <th>Question</th>
                    <th>Grade</th>
                </tr>
                </thead>
                <tbody>
                {question_grades &&
                    Object.entries(question_grades).map(([question, score]) => (
                        <tr key={question}>
                            <td>{question}</td>
                            <td className={score >= 5 ? styles.pass : styles.fail}>{score}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GradeDetails;
