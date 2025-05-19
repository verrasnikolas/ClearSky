import React, { useState } from 'react';
import { submitReview } from '../services/ReviewService';
import styles from './ReviewForm.module.css';

const ReviewForm = ({ course, studentId }) => {
    const [reason, setReason] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await submitReview({
                student_id: studentId,
                course_id: course.courseId,
                reason
            });
            setSubmitted(true);
            setReason('');
        } catch (err) {
            console.error('Failed to submit review:', err);
            alert('Something went wrong.');
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                NEW REVIEW REQUEST <span className={styles.context}>{course.name} – {course.term}</span>
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
                    <button type="submit" className={styles.button} disabled={submitted}>
                        {submitted ? 'Review Submitted' : 'Submit grade review request'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReviewForm;
