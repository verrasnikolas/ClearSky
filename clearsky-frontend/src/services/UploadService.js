// src/services/UploadService.js
import { uploadApi } from './api';

export const uploadInitialGrades = (formData) =>
    uploadApi.post('/initial', formData);
