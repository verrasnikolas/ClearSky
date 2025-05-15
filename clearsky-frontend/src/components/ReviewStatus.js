import React, { useEffect, useState } from 'react';
import styles from './ReviewStatus.module.css';
import { getAllReviews } from '../services/ReviewService'; // or filter by course

const ReviewStatus = ({ course }) => {
    const [review, setReview] = useState(null);

    useEffect(() => {
        const fetchReview = async () => {
            const res = await getAllReviews();
            const match = res.data.find(r => r.gradeEntryId === course.id);
            setReview(match || { status: 'N/A', response: 'No review submitted.' });
        };
        fetchReview();
    }, [course]);

    return (
        <div className={styles.box}>
            <div className={styles.header}>REVIEW REQUEST STATUS — {course.name} ({course.term})</div>
            <div className={styles.message}>
                <strong>Status:</strong> {review?.status || 'N/A'}
            </div>
            <textarea readOnly className={styles.responseBox} value={review?.response || 'No instructor response yet.'} />
            <div className={styles.footer}>
                <button className={styles.button}>Download Attachment</button>
                <button className={styles.button}>Ack</button>
            </div>
        </div>
    );
};

export default ReviewStatus;
