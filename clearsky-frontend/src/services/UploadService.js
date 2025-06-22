// src/services/UploadService.js
import { uploadApi } from './api';

export const confirmCourse = (formData) =>
    uploadApi.post('/preview', formData);

export const uploadInitialGrades = (formData) =>
    uploadApi.post('/initial', formData);

export const uploadFinalGrades = (formData) =>
    uploadApi.post('/final', formData);