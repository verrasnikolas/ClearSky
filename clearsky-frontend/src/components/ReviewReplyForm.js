import React, { useState } from 'react';
import styles from './ReviewReplyForm.module.css';

const ReviewReplyForm = ({ selectedReview, studentInfo, courseInfo, onSubmit }) => {    const [status, setStatus] = useState('APPROVED');
    const [response, setResponse] = useState('');
    const [file, setFile] = useState(null); // optional future feature

    if (!selectedReview) return null;

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //
    //     onSubmit({
    //         student_id: selectedReview.student_id,
    //         course_id: selectedReview.course_id,
    //         status,
    //         response
    //         // You can also include file/attachment logic here later
    //     });
    // };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('student_id', selectedReview.student_id);
        formData.append('course_id', selectedReview.course_id);
        formData.append('status', status);
        formData.append('response', response);
        if (file) {
            formData.append('attachment', file);
        }

        onSubmit(formData); // call parent handler with form data
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                REPLY TO GRADE REVIEW REQUEST
                <span className={styles.context}>
                    Student: {studentInfo?.academicId || selectedReview.student_id} |
                    Course: {courseInfo ? `${courseInfo.title} (${courseInfo.code})` : selectedReview.course_id}
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
                    required
                />

                {/* Optional file upload for future */}
                {/*
                <input
                    type="file"
                    className={styles.fileInput}
                    onChange={(e) => setFile(e.target.files[0])}
                />
                */}
                <label className={styles.label}>Attachment (optional)</label>
                <input
                    type="file"
                    accept=".pdf,.docx,.png,.jpg"
                    className={styles.fileInput}
                    onChange={(e) => setFile(e.target.files[0])}
                />


                <div className={styles.buttonContainer}>
                    <button type="submit" className={styles.button}>
                        Submit Reply
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReviewReplyForm;
