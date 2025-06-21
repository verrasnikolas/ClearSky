import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import styles from './InstructorCourses.module.css'; // use same CSS layout
import { getCoursesByInstructor } from '../../services/GradeService';

const InstructorFinalizationPage = () => {
    const [courses, setCourses] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInstructorCourses = async () => {
            try {
                const courseRes = await getCoursesByInstructor();
                const formatted = courseRes.data.map((entry, index) => ({
                    id: index + 1,
                    course_id: entry.id,
                    code: entry.code,
                    name: entry.title,
                    semester: entry.semester,
                    status: entry.status
                }));
                setCourses(formatted);
            } catch (err) {
                console.error('Failed to load instructor data:', err);
                setErrorMessage('Failed to load your course list.');
            }
        };
        fetchInstructorCourses();
    }, []);


    const handleUploadFinalGrades = (course) => {
        navigate(`/instructor/upload-final/${course.course_id}`);
    };

    return (
        <>
            <div className={styles.container}>
                <h2 className={styles.heading}>My Graded Courses</h2>

                {errorMessage && (
                    <Alert severity="error" onClose={() => setErrorMessage(null)}>
                        {errorMessage}
                    </Alert>
                )}

                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>Course Code</th>
                        <th>Course Title</th>
                        <th>Exam Period</th>
                        <th>Grading Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {courses.map((course) => (
                        <tr key={course.id}>
                            <td>{course.code}</td>
                            <td>{course.name}</td>
                            <td>{course.semester}</td>
                            <td>{course.status}</td>
                            <td className={styles.actionsCell}>
                                <button
                                    className={styles.btn}
                                    disabled={course.status !== 'open'}
                                    onClick={() => handleUploadFinalGrades(course)}
                                >
                                    Finalize
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default InstructorFinalizationPage;
