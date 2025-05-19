import React, { useEffect, useState } from 'react';
import ReviewForm from '../../components/ReviewForm';
import GradeDetails from '../../components/GradeDetails';
import ReviewStatus from '../../components/ReviewStatus';
import styles from './StudentPage.module.css';
import StudentNavbar from './StudentNavbar';
import {
    getGradesByUser,
    getGradeForStudentCourse
} from '../../services/GradeService';
import { getReviewStatus } from '../../services/ReviewService';

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
