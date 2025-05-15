import React, { useState } from 'react';
import { uploadGrades } from '../../services/GradeService';
import styles from './UploadGrades.module.css';

const UploadGrades = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        setFile(selected);
        setMessage('');
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await uploadGrades(formData); // ✅ use your service
            setPreview({
                course: res.data.course,
                period: res.data.period,
                count: res.data.count,
            });
            setMessage('File uploaded and parsed successfully.');
        } catch (err) {
            console.error(err);
            setMessage('Failed to upload or parse file.');
        }
    };


    const handleConfirm = () => {
        setMessage('Grades confirmed and submitted.');
        setPreview(null);
        setFile(null);
    };

    const handleCancel = () => {
        setMessage('Upload canceled.');
        setPreview(null);
        setFile(null);
    };

    return (
        <div className={styles.container}>
            <h2>Initial Grades Posting</h2>

            <div className={styles.uploadSection}>
                <label>Select file to upload or drag and drop</label>
                <input type="file" accept=".xlsx" onChange={handleFileChange} />
                <button onClick={handleUpload}>Submit Initial Grades</button>
            </div>

            {preview && (
                <div className={styles.previewBox}>
                    <h3>XLSX File Parsing</h3>
                    <p><strong>Course:</strong> {preview.course}</p>
                    <p><strong>Period:</strong> {preview.period}</p>
                    <p><strong>Number of grades:</strong> {preview.count}</p>
                    <div className={styles.buttonGroup}>
                        <button onClick={handleConfirm}>Confirm</button>
                        <button onClick={handleCancel}>Cancel</button>
                    </div>
                </div>
            )}

            <div className={styles.messageBox}>
                <p>{message}</p>
            </div>
        </div>
    );
};

export default UploadGrades;
