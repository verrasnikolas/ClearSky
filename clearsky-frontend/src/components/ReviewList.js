import React, { useEffect, useState } from 'react';
import { getAllReviews, replyToReview } from '../services/ReviewService';
import ReviewReplyForm from './ReviewReplyForm'; // <-- make sure this exists
import styles from './ReviewList.module.css';

const ReviewList = () => {
    const [reviews, setReviews] = useState([]);
    const [selectedReview, setSelectedReview] = useState(null);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const result = await getAllReviews();
            console.log("Fetched reviews:", result);
            setReviews(result.data);
        } catch (err) {
            console.error("Failed to fetch reviews:", err);
        }
    };

    const handleReplySubmit = async (update) => {
        try {
            await replyToReview(update.id, update);
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
                        <th>Grade Entry ID</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>Response</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {reviews.map((review) => (
                        <tr key={review.id}>
                            <td>{review.gradeEntryId}</td>
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
