// src/components/UploadFinalGrades.js

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
    Container, Card, CardContent, Typography, Box, Button,
    Alert, Stack, CircularProgress
} from '@mui/material';
import {
    CloudUpload as UploadIcon,
    CheckCircle as CheckIcon,
    Error as ErrorIcon,
    Info as InfoIcon
} from '@mui/icons-material';
import { uploadFinalGrades } from '../../services/UploadService';

export default function UploadFinalGrades() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState({ text: '', severity: 'info' });
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);

    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles.length) {
            setFile(acceptedFiles[0]);
            setPreview(null);
            setMessage({ text: '', severity: 'info' });
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [] },
        multiple: false
    });

    const handleUpload = async () => {
        if (!file) {
            setMessage({ text: 'Please select a file first.', severity: 'error' });
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await uploadFinalGrades(formData);
            setPreview({
                course: res.data.course,
                period: res.data.period,
                count: res.data.count
            });
            setMessage({
                text: 'Final grades uploaded successfully.',
                severity: 'success'
            });
        } catch (err) {
            console.error(err);
            setMessage({ text: 'Upload failed. Please try again.', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Card sx={{ boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Final Grades Posting
                    </Typography>

                    {/* Dropzone Area */}
                    <Box
                        {...getRootProps()}
                        sx={{
                            border: '2px dashed',
                            borderColor: isDragActive ? 'primary.main' : 'grey.400',
                            borderRadius: 1,
                            p: 4,
                            textAlign: 'center',
                            bgcolor: isDragActive ? 'primary.light' : 'grey.50',
                            cursor: 'pointer',
                            mb: 2
                        }}
                    >
                        <input {...getInputProps()} />
                        <UploadIcon fontSize="large" color="action" />
                        <Typography>
                            {file
                                ? file.name
                                : isDragActive
                                    ? 'Drop here to select'
                                    : 'Drag & drop .xlsx here, or click to browse'}
                        </Typography>
                    </Box>

                    {/* Upload Button */}
                    <Button
                        variant="contained"
                        startIcon={<UploadIcon />}
                        onClick={handleUpload}
                        disabled={loading}
                        fullWidth
                        sx={{ mb: 2 }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit Final Grades'}
                    </Button>

                    {/* Preview */}
                    {preview && (
                        <Card variant="outlined" sx={{ bgcolor: 'grey.100', mb: 2 }}>
                            <CardContent>
                                <Typography variant="subtitle1" gutterBottom>
                                    Final Grades Preview
                                </Typography>
                                <Typography>Course: {preview.course}</Typography>
                                <Typography>Period: {preview.period}</Typography>
                                <Typography>Number of grades: {preview.count}</Typography>
                                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        startIcon={<CheckIcon />}
                                        onClick={() =>
                                            setMessage({
                                                text: 'Final grades confirmed.',
                                                severity: 'success'
                                            })
                                        }
                                    >
                                        Confirm
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<ErrorIcon />}
                                        onClick={() => {
                                            setPreview(null);
                                            setFile(null);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </Stack>
                            </CardContent>
                        </Card>
                    )}

                    {/* Status Message */}
                    {message.text && (
                        <Alert
                            severity={message.severity}
                            iconMapping={{
                                success: <CheckIcon />,
                                error: <ErrorIcon />,
                                info: <InfoIcon />
                            }}
                        >
                            {message.text}
                        </Alert>
                    )}
                </CardContent>
            </Card>
        </Container>
    );
}
