import React, { useEffect, useState } from 'react';
import ReviewForm from '../../components/ReviewForm';
import GradeDetails from '../../components/GradeDetails';
import ReviewStatus from '../../components/ReviewStatus';
import styles from './StudentPage.module.css';
import StudentNavbar from './StudentNavbar';
import { getGradesByUser } from '../../services/GradeService';

const STUDENT_ID = '03181110';

const StudentPage = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourseForReview, setSelectedCourseForReview] = useState(null);
    const [selectedCourseForGrades, setSelectedCourseForGrades] = useState(null);
    const [selectedReviewStatus, setSelectedReviewStatus] = useState(null);

    const clearAll = () => {
        setSelectedCourseForReview(null);
        setSelectedCourseForGrades(null);
        setSelectedReviewStatus(null);
    };

    const handleAskReview = (course) => {
        clearAll();
        setSelectedCourseForReview(course);
    };

    const handleViewGrades = (course) => {
        clearAll();
        setSelectedCourseForGrades(course);
    };

    const handleViewStatus = (course) => {
        clearAll();
        setSelectedReviewStatus(course);
    };

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await getGradesByUser(STUDENT_ID);
                const extracted = res.data.map((entry, index) => ({
                    id: index + 1,
                    name: entry.course.title,
                    term: entry.course.semester,
                    status: entry.final_grade !== null ? 'closed' : 'open',
                }));
                setCourses(extracted);
            } catch (err) {
                console.error('Failed to fetch courses for student:', err);
            }
        };
        fetchCourses();
    }, []);

    return (
        <>
            <StudentNavbar />
            <div className={styles.container}>
                <h2 className={styles.heading}>My Courses</h2>
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>Course Name</th>
                        <th>Exam Period</th>
                        <th>Grading Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {courses.map(course => (
                        <tr key={course.id}>
                            <td>{course.name}</td>
                            <td>{course.term}</td>
                            <td>{course.status}</td>
                            <td className={styles.actionsCell}>
                                <button className={styles.btn} onClick={() => handleViewGrades(course)}>
                                    View My Grades
                                </button>
                                <button
                                    className={styles.btn}
                                    disabled={course.status !== 'open'}
                                    onClick={() => handleAskReview(course)}
                                >
                                    Ask for Review
                                </button>
                                <button className={styles.btn} onClick={() => handleViewStatus(course)}>
                                    View Review Status
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {selectedCourseForGrades && (
                    <div className={styles.detailsSection}>
                        <GradeDetails course={selectedCourseForGrades} />
                    </div>
                )}

                {selectedCourseForReview && (
                    <div className={styles.detailsSection}>
                        <ReviewForm course={selectedCourseForReview} />
                    </div>
                )}

                {selectedReviewStatus && (
                    <div className={styles.detailsSection}>
                        <ReviewStatus course={selectedReviewStatus} />
                    </div>
                )}
            </div>
        </>
    );
};

export default StudentPage;
