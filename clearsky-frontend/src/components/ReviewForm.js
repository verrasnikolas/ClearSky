import React, { useState } from 'react';
import { submitReview } from '../services/ReviewService';
import styles from './ReviewForm.module.css';

const ReviewForm = () => {
    const [gradeEntryId, setGradeEntryId] = useState('');
    const [reason, setReason] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await submitReview({ gradeEntryId, reason });
        alert('Review submitted!');
        setGradeEntryId('');
        setReason('');
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <input
                type="text"
                placeholder="Grade Entry ID"
                value={gradeEntryId}
                onChange={(e) => setGradeEntryId(e.target.value)}
                className={styles.input}
                required
            />
            <textarea
                placeholder="Reason for review"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className={styles.textarea}
                required
            />
            <button type="submit" className={styles.button}>
                Submit Review
            </button>
        </form>
    );
};

export default ReviewForm;
