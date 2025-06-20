import styles from './ReviewStatus.module.css';
import { Alert } from '@mui/material';
import React, { useState } from 'react';
import { acknowledgeReview } from '../services/ReviewService';



const ReviewStatus = ({ course }) => {
    const [ackMessage, setAckMessage] = useState(null);

    if (!course) return null;

    const { name, term, status, reason, response } = course;

    const hasReview = reason || status;

    const handleAcknowledge = async () => {
        try {
            await acknowledgeReview(course.student_id, course.courseId);
            setAckMessage('Review acknowledged!');
        } catch (err) {
            console.error('Failed to acknowledge review:', err);
            setAckMessage('Failed to acknowledge review.');
        }
    };


    return (
        <div className={styles.wrapper}>
            <h2 className={styles.title}>
                REVIEW REQUEST STATUS — {name} ({term})
            </h2>
            {ackMessage && (
                <div style={{ marginBottom: '1rem' }}>
                    <Alert severity="success" onClose={() => setAckMessage(null)}>
                        {ackMessage}
                    </Alert>
                </div>
            )}


            <p className={styles.label}>
                <strong>Status:</strong> {status ?? 'N/A'}
            </p>

            {hasReview ? (
                <div className={styles.reviewBox}>
                    <p><strong>Reason:</strong> {reason}</p>
                    <p><strong>Instructor Response:</strong> {response || 'Not responded yet.'}</p>
                </div>
            ) : (
                <div className={styles.reviewBox}>
                    No review submitted.
                </div>
            )}

            <div className={styles.actions}>
                {course.attachment ? (
                    <a
                        href={`http://localhost/api/review-attachments/${course.attachment}`}                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.btn}
                        download
                    >
                        Download Attachment
                    </a>
                ) : (
                    <button className={styles.btn} disabled>
                        No Attachment
                    </button>
                )}

                {course.status !== 'ACKNOWLEDGED' ? (
                    <button className={styles.btn} onClick={handleAcknowledge}>
                        Ack
                    </button>
                ) : (
                    <button className={styles.btn} disabled>
                        Already Acknowledged
                    </button>
                )}


            </div>

        </div>
    );
    };export default ReviewStatus;
