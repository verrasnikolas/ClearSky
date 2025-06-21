import React, { useEffect, useState } from 'react';
import { getAllReviews, replyToReview } from '../services/ReviewService';
import ReviewReplyForm from './ReviewReplyForm';
import styles from './ReviewList.module.css';
import { getCoursesByInstructor, getCourseById } from '../services/GradeService';
import { getUserById } from '../services/UserService';
import { decodeToken } from '../auth/token';

const decoded = decodeToken(localStorage.getItem('accessToken'));
const INSTRUCTOR_ID = decoded?.userId;

const ReviewList = () => {
    const [reviews, setReviews] = useState([]);
    const [displayData, setDisplayData] = useState({});
    const [selectedReview, setSelectedReview] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            // Get course IDs for this instructor
            const coursesRes = await getCoursesByInstructor();
            const courseIds = coursesRes.data.map(course => course.id);

            const reviewsRes = await getAllReviews();
            const allReviews = reviewsRes.data;

            const filteredReviews = allReviews.filter(review =>
                courseIds.includes(review.course_id)
            );

            setReviews(filteredReviews);

            await loadDisplayData(filteredReviews);
        } catch (err) {
            console.error("Failed to fetch reviews:", err);
        } finally {
            setLoading(false);
        }
    };

    const loadDisplayData = async (reviewsToLoad) => {
        const enriched = {};

        await Promise.all(reviewsToLoad.map(async (review) => {
            const key = `${review.student_id}_${review.course_id}`;
            try {
                const [courseRes, studentRes] = await Promise.all([
                    getCourseDetailsById(review.course_id),
                    getUserById(review.student_id)
                ]);

                enriched[key] = {
                    course: courseRes.data,
                    student: studentRes.data
                };
            } catch (err) {
                console.warn(`Could not enrich review ${key}`, err);
            }
        }));

        setDisplayData(enriched);
    };

    const handleReplySubmit = async (formData) => {
        try {
            await replyToReview(formData);
            setSelectedReview(null);
            fetchReviews();
        } catch (err) {
            console.error("Failed to update review:", err);
        }
    };

    return (
        <div className={styles.container}>
            <h3>Review Requests</h3>

            {loading ? (
                <p>Loading...</p>
            ) : reviews.length === 0 ? (
                <p>No pending reviews.</p>
            ) : (
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>Student Academic ID</th>
                        <th>Course</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>Response</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {reviews.map((review) => {
                        const key = `${review.student_id}_${review.course_id}`;
                        const info = displayData[key] || {};
                        const studentId = info.student?.academicId || review.student_id;
                        const courseInfo = info.course
                            ? `${info.course.title} (${info.course.code})`
                            : review.course_id;

                        return (
                            <tr key={key}>
                                <td>{studentId}</td>
                                <td>{courseInfo}</td>
                                <td>{review.reason}</td>
                                <td>{review.status}</td>
                                <td>{review.response || '-'}</td>
                                <td>
                                    <button onClick={() => setSelectedReview(review)}>
                                        Reply
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            )}

            {selectedReview && (
                <ReviewReplyForm
                    selectedReview={selectedReview}
                    studentInfo={displayData[`${selectedReview.student_id}_${selectedReview.course_id}`]?.student}
                    courseInfo={displayData[`${selectedReview.student_id}_${selectedReview.course_id}`]?.course}
                    onSubmit={handleReplySubmit}
                />
            )}
        </div>
    );
};

export default ReviewList;
