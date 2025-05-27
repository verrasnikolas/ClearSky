import styles from './ReviewStatus.module.css';
import { Alert } from '@mui/material';
import React, { useState } from 'react';


const ReviewStatus = ({ course }) => {
    const [ackMessage, setAckMessage] = useState(null);

    if (!course) return null;

    const { name, term, status, reason, response } = course;

    const hasReview = reason || status;



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
                        href={`http://localhost:30003/uploads/${course.attachment}`}
                        target="_blank"
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

                <button
                    className={styles.btn}
                    onClick={() => setAckMessage('Review acknowledged!')}
                >
                    Ack
                </button>

            </div>

        </div>
    );
    };export default ReviewStatus;
