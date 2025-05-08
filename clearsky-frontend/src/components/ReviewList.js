import React, { useEffect, useState } from 'react';
import { getAllReviews, replyToReview } from '../services/ReviewService';
import styles from './ReviewList.module.css';

const ReviewList = () => {
    const [reviews, setReviews] = useState([]);
    const [statusUpdates, setStatusUpdates] = useState({});

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        const result = await getAllReviews();
        console.log("Fetched reviews:", result);
        setReviews(result.data); // ✅ FIX: use the actual array inside .data
    };


    const handleChange = (id, field, value) => {
        setStatusUpdates((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value,
            },
        }));
    };

    const handleSubmit = async (id) => {
        const update = statusUpdates[id];
        if (!update?.status || !update?.response) return;

        await replyToReview(id, update);
        await fetchReviews(); // refresh list
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
                            <td>
                                <select
                                    value={statusUpdates[review.id]?.status || review.status}
                                    onChange={(e) => handleChange(review.id, 'status', e.target.value)}
                                >
                                    <option value="PENDING">PENDING</option>
                                    <option value="APPROVED">APPROVED</option>
                                    <option value="REJECTED">REJECTED</option>
                                </select>
                            </td>
                            <td>
                                <input
                                    type="text"
                                    placeholder="Reply..."
                                    value={statusUpdates[review.id]?.response || ''}
                                    onChange={(e) => handleChange(review.id, 'response', e.target.value)}
                                />
                            </td>
                            <td>
                                <button onClick={() => handleSubmit(review.id)}>Update</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ReviewList;
