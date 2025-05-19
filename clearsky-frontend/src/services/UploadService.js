// src/services/UploadService.js
import { uploadApi } from './api';

export const uploadInitialGrades = (formData) =>
    uploadApi.post('/initial', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
