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
        <div className={styles.wrapper}>
            <div className={styles.header}>
                NEW REVIEW REQUEST <span className={styles.context}>physics – spring 2025</span>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
                <label className={styles.label}>Message to instructor</label>
                <textarea
                    placeholder="Enter your reason for review"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className={styles.textarea}
                    required
                />
                <div className={styles.buttonContainer}>
                    <button type="submit" className={styles.button}>
                        Submit grade review request
                    </button>
                </div>
            </form>
        </div>
    );

};

export default ReviewForm;
