import React, { useEffect, useState } from 'react';
import styles from './GradeDetails.module.css';
import { getGradesByUser } from '../services/GradeService';

const STUDENT_ID = '03181110';

const GradeDetails = ({ course }) => {
    const [entry, setEntry] = useState(null);

    useEffect(() => {
        const fetchGrades = async () => {
            try {
                const res = await getGradesByUser(STUDENT_ID);
                const courseGrades = res.data;

                // Match by course title
                const match = courseGrades.find(g => g.course.title === course.name);
                setEntry(match || null);
            } catch (err) {
                console.error('Failed to fetch grade data:', err);
            }
        };

        fetchGrades();
    }, [course]);

    if (!entry) return <p>No grades found for {course.name}.</p>;

    return (
        <div className={styles.gradesBox}>
            <h4>{entry.course.title} – {entry.course.semester}</h4>
            <p><strong>Initial Grade:</strong> {entry.initial_grade}</p>
            {entry.final_grade && <p><strong>Final Grade:</strong> {entry.final_grade}</p>}

            <table className={styles.questionTable}>
                <thead>
                <tr>
                    <th>Q#</th>
                    <th>Score</th>
                    <th>Weight (%)</th>
                </tr>
                </thead>
                <tbody>
                {entry.questions.map(q => (
                    <tr key={q.question_id}>
                        <td>{q.question_id}</td>
                        <td>{q.initial_score}</td>
                        <td>{q.weight}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default GradeDetails;
