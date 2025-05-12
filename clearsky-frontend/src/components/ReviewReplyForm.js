import React, { useState } from 'react';
import styles from './ReviewReplyForm.module.css';

const ReviewReplyForm = ({ selectedReview, onSubmit }) => {
    const [status, setStatus] = useState('APPROVED');
    const [response, setResponse] = useState('');
    const [file, setFile] = useState(null); // optional for attachments

    if (!selectedReview) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            id: selectedReview.id,
            status,
            response,
            attachment: file, // you can extend this on backend
        });
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                REPLY TO GRADE REVIEW REQUEST
                <span className={styles.context}>
          {selectedReview.course || 'Course'} – {selectedReview.term || 'Term'} – {selectedReview.student || 'Student'}
        </span>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
                <label className={styles.label}>Action</label>
                <select
                    className={styles.select}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="APPROVED">Total accept</option>
                    <option value="REJECTED">Reject</option>
                    <option value="PARTIAL">Partial accept</option>
                </select>

                <label className={styles.label}>Instructor's message</label>
                <textarea
                    className={styles.textarea}
                    placeholder="Explain your decision"
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                />

                <input
                    type="file"
                    className={styles.fileInput}
                    onChange={(e) => setFile(e.target.files[0])}
                />

                <div className={styles.buttonContainer}>
                    <button type="submit" className={styles.button}>
                        Upload reply attachment
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReviewReplyForm;
