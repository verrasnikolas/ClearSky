import React from 'react';
import styles from './ReviewStatus.module.css';

const ReviewStatus = ({ course }) => {
    if (!course) return null;

    const { name, term, status, reason, response } = course;

    const hasReview = reason || status;

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.title}>
                REVIEW REQUEST STATUS — {name} ({term})
            </h2>

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
                <button className={styles.btn}>Download Attachment</button>
                <button className={styles.btn}>Ack</button>
            </div>
        </div>
    );
};

export default ReviewStatus;
