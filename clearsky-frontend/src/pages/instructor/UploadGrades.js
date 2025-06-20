import React, { useState, useCallback } from 'react';
import { decodeToken } from '../../auth/token';
import { useDropzone } from 'react-dropzone';
import {
    Container,
    Card,
    CardContent,
    Typography,
    Box,
    Button,
    Alert,
    Stack,
    CircularProgress
} from '@mui/material';
import {
    CloudUpload as UploadIcon,
    CheckCircle as CheckIcon,
    Error as ErrorIcon,
    Info as InfoIcon
} from '@mui/icons-material';
import { uploadInitialGrades } from '../../services/UploadService';

export default function UploadGrades() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [message, setMessage] = useState({ text: '', severity: 'info' });
    const [loading, setLoading] = useState(false);

    // 1) dropzone setup
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
        for (let [key, value] of formData.entries()) {
            console.log(`[FRONTEND] FormData field: ${key}`, value);
        }

        try {
            const res = await uploadInitialGrades(formData);
            setPreview({
                course: res.data.course,
                period: res.data.period,
                count: res.data.count
            });
            setMessage({ text: 'File uploaded and parsed successfully.', severity: 'success' });
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
                        Initial Grades Posting
                    </Typography>

                    {/* 3) Dropzone area */}
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

                    {/* 4) Submit button */}
                    <Button
                        variant="contained"
                        startIcon={<UploadIcon />}
                        onClick={handleUpload}
                        disabled={loading}
                        fullWidth
                        sx={{ mb: 2 }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit Initial Grades'}
                    </Button>

                    {/* 5) Preview card */}
                    {preview && (
                        <Card variant="outlined" sx={{ bgcolor: 'grey.100', mb: 2 }}>
                            <CardContent>
                                <Typography variant="subtitle1" gutterBottom>
                                    XLSX File Preview
                                </Typography>
                                <Typography>Course: {preview.course}</Typography>
                                <Typography>Period: {preview.period}</Typography>
                                <Typography>Number of grades: {preview.count}</Typography>
                                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        startIcon={<CheckIcon />}
                                        onClick={() => setMessage({ text: 'Grades confirmed.', severity: 'success' })}
                                    >
                                        Confirm
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<ErrorIcon />}
                                        onClick={() => { setPreview(null); setFile(null); }}
                                    >
                                        Cancel
                                    </Button>
                                </Stack>
                            </CardContent>
                        </Card>
                    )}

                    {/* 6) Status message */}
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
