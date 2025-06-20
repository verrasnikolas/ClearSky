import React, { useEffect, useState } from 'react';
import ReviewForm from '../../components/ReviewForm';
import GradeDetails from '../../components/GradeDetails';
import ReviewStatus from '../../components/ReviewStatus';
import styles from './StudentPage.module.css';
import StudentNavbar from './StudentNavbar';
import { Alert } from '@mui/material'; // ⬅ Make sure this is imported


import {
    getGradesByUser,
    getGradeForStudentCourse
} from '../../services/GradeService';
import { getReviewStatus } from '../../services/ReviewService';
import {decodeToken} from "../../auth/token";


const decoded = decodeToken(localStorage.getItem('accessToken'));
const STUDENT_ID = decoded?.userId;

const StudentPage = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourseForReview, setSelectedCourseForReview] = useState(null);
    const [selectedCourseForGrades, setSelectedCourseForGrades] = useState(null);
    const [selectedReviewStatus, setSelectedReviewStatus] = useState(null);

    const [errorMessage, setErrorMessage] = useState(null);

    const clearAll = () => {
        setSelectedCourseForReview(null);
        setSelectedCourseForGrades(null);
        setSelectedReviewStatus(null);
        setErrorMessage(null); // 👈 Clear any previous errors
    };


    const handleAskReview = async (course) => {
        clearAll();

        try {
            const res = await getReviewStatus(STUDENT_ID, course.courseId);

            if (res?.data?.status) {
                setErrorMessage('You have already submitted a review request for this course.');
                return;
            }

            // No existing review found, allow form
            setSelectedCourseForReview(course);
        } catch (err) {
            // If the backend returns 404 for no review — allow it
            if (err.response && err.response.status === 404) {
                setSelectedCourseForReview(course);
            } else {
            console.error('Error checking review status:', err);
            alert('Could not check review status. Please try again.');
        }

    }
    };

    const handleViewGrades = async (course) => {
        clearAll();
        try {
            const res = await getGradeForStudentCourse(STUDENT_ID, course.courseId);
            const gradeData = res.data;

            setSelectedCourseForGrades({
                courseId: course.courseId,
                name: course.name,
                term: course.term,
                grade: gradeData.grade,
                question_grades: gradeData.question_grades
            });
        } catch (err) {
            console.error('Failed to fetch grade details:', err);
            alert('Could not load grades for this course.');
        }
    };

    const handleViewStatus = async (course) => {
        clearAll();
        try {
            const res = await getReviewStatus(STUDENT_ID, course.courseId);
            setSelectedReviewStatus({
                courseId: course.courseId,
                name: course.name,
                term: course.term,
                ...res.data // includes reason, status, response, timestamps
            });
        } catch (err) {
            console.error('No review found:', err);
            alert('No review request found for this course.');
        }
    };

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await getGradesByUser(STUDENT_ID);
                const extracted = res.data.map((entry, index) => ({
                    id: index + 1,
                    courseId: entry.course_id,
                    name: entry.course_name,
                    term: entry.semester,
                    status: entry.grading_status
                }));
                setCourses(extracted);
            } catch (err) {
                console.error('Failed to fetch courses for student:', err);
                alert('Failed to load courses.');
            }
        };
        fetchCourses();
    }, []);

    return (
        <>
            <StudentNavbar />
            <div className={styles.container}>
                <h2 className={styles.heading}>My Courses</h2>
                {errorMessage && (
                    <div style={{ marginBottom: '1rem' }}>
                        <Alert severity="error" onClose={() => setErrorMessage(null)}>
                            {errorMessage}
                        </Alert>
                    </div>
                )}
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
                    {courses.map((course) => (
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
                        <ReviewForm course={selectedCourseForReview} studentId={STUDENT_ID} />
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
