import React, { useEffect, useState } from 'react';
import { getAllReviews, replyToReview } from '../services/ReviewService';
import ReviewReplyForm from './ReviewReplyForm';
import styles from './ReviewList.module.css';
import { getCoursesByInstructor } from '../services/GradeService';


import { decodeToken } from '../auth/token';

const decoded = decodeToken(localStorage.getItem('accessToken'));
const INSTRUCTOR_ID = decoded?.userId;



const ReviewList = () => {
    const [reviews, setReviews] = useState([]);
    const [selectedReview, setSelectedReview] = useState(null);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            // Get course IDs for this instructor
            const coursesRes = await getCoursesByInstructor(INSTRUCTOR_ID);
            const courseIds = coursesRes.data.map(course => course.id);

            // Get all reviews
            const reviewsRes = await getAllReviews();
            const allReviews = reviewsRes.data;

            // Filter reviews to only those for instructor's courses
            const filteredReviews = allReviews.filter(review =>
                courseIds.includes(review.course_id)
            );

            setReviews(filteredReviews);
        } catch (err) {
            console.error("Failed to fetch reviews:", err);
        }
    };


    // const handleReplySubmit = async (update) => {
    //     try {
    //         await replyToReview({
    //             student_id: update.student_id,
    //             course_id: update.course_id,
    //             status: update.status,
    //             response: update.response
    //         });
    //
    //         setSelectedReview(null);
    //         fetchReviews();
    //     } catch (err) {
    //         console.error("Failed to update review:", err);
    //     }
    // };

    const handleReplySubmit = async (formData) => {
        try {
            await replyToReview(formData); // Now passing FormData directly

            setSelectedReview(null);
            fetchReviews();
        } catch (err) {
            console.error("Failed to update review:", err);
        }
    };


    return (
        <div className={styles.container}>
            <h3>Review Requests</h3>

            {reviews.length === 0 ? (
                <p>No pending reviews.</p>
            ) : (
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>Student ID</th>
                        <th>Course ID</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>Response</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {reviews.map((review) => (
                        <tr key={review.id}>
                            <td>{review.student_id}</td>
                            <td>{review.course_id}</td>
                            <td>{review.reason}</td>
                            <td>{review.status}</td>
                            <td>{review.response || '-'}</td>
                            <td>
                                <button onClick={() => setSelectedReview(review)}>
                                    Reply
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {selectedReview && (
                <ReviewReplyForm
                    selectedReview={selectedReview}
                    onSubmit={handleReplySubmit}
                />
            )}
        </div>
    );
};

export default ReviewList;
