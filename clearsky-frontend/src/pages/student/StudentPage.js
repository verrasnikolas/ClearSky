import React, { useEffect, useState } from 'react';
import ReviewForm from '../../components/ReviewForm';
import GradeDetails from '../../components/GradeDetails';
import ReviewStatus from '../../components/ReviewStatus';
import styles from './StudentPage.module.css';
import StudentNavbar from './StudentNavbar';
import { Alert } from '@mui/material';

import {
    getGradesByUser,
    getGradeForStudentCourse
} from '../../services/GradeService';
import { getReviewStatus } from '../../services/ReviewService';
import { getUserById } from '../../services/UserService';
import { decodeToken } from '../../auth/token';

const StudentPage = () => {
    const [userId, setUserId] = useState(null);
    const [academicId, setAcademicId] = useState(null);
    const [courses, setCourses] = useState([]);
    const [selectedCourseForReview, setSelectedCourseForReview] = useState(null);
    const [selectedCourseForGrades, setSelectedCourseForGrades] = useState(null);
    const [selectedReviewStatus, setSelectedReviewStatus] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(true);

    // Decode token and set userId
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const decoded = decodeToken(token);
        setUserId(decoded?.userId);
    }, []);

    const clearAll = () => {
        setSelectedCourseForReview(null);
        setSelectedCourseForGrades(null);
        setSelectedReviewStatus(null);
        setErrorMessage(null);
    };

    const handleAskReview = async (course) => {
        clearAll();

        if (!userId || !academicId) {
            alert('Student profile not loaded yet. Please wait.');
            return;
        }

        try {
            const res = await getReviewStatus(userId, course.courseId);
            if (res?.data?.status) {
                setErrorMessage('You have already submitted a review request for this course.');
                return;
            }
            setSelectedCourseForReview(course);
        } catch (err) {
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

        if (!academicId) {
            alert('Student profile not loaded yet. Please wait.');
            return;
        }

        try {
            const res = await getGradeForStudentCourse(academicId, course.courseId);
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

        if (!userId) {
            alert('Student profile not loaded yet. Please wait.');
            return;
        }

        try {
            const res = await getReviewStatus(userId, course.courseId);
            setSelectedReviewStatus({
                courseId: course.courseId,
                name: course.name,
                term: course.term,
                ...res.data,
                student_id: userId
            });
        } catch (err) {
            console.error('No review found:', err);
            alert('No review request found for this course.');
        }
    };

    // Fetch user + academicId + courses when userId is available
    useEffect(() => {
        const fetchUserAndCourses = async () => {
            if (!userId) return;

            try {
                const userRes = await getUserById(userId);
                const academicId = userRes.data.academicId;
                setAcademicId(academicId);

                const gradeRes = await getGradesByUser(academicId);
                const extracted = gradeRes.data.map((entry, index) => ({
                    id: index + 1,
                    courseId: entry.course_id,
                    name: entry.course_name,
                    term: entry.semester,
                    status: entry.grading_status
                }));
                setCourses(extracted);
            } catch (err) {
                console.error('Failed to load user or grades:', err);
                alert('Failed to load your course data.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserAndCourses();
    }, [userId]);

    return (
        <>
            <StudentNavbar />
            <div className={styles.container}>
                <h2 className={styles.heading}>My Courses</h2>

                {loading ? (
                    <p>Loading student data...</p>
                ) : (
                    <>
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
                                        <button
                                            className={styles.btn}
                                            disabled={!academicId}
                                            onClick={() => handleViewGrades(course)}
                                        >
                                            View My Grades
                                        </button>
                                        <button
                                            className={styles.btn}
                                            disabled={course.status !== 'open' || !academicId}
                                            onClick={() => handleAskReview(course)}
                                        >
                                            Ask for Review
                                        </button>
                                        <button
                                            className={styles.btn}
                                            disabled={!academicId}
                                            onClick={() => handleViewStatus(course)}
                                        >
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
                                <ReviewForm course={selectedCourseForReview} studentId={academicId} />
                            </div>
                        )}

                        {selectedReviewStatus && (
                            <div className={styles.detailsSection}>
                                <ReviewStatus course={selectedReviewStatus} />
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default StudentPage;
