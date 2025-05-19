// src/services/UploadService.js
import { uploadApi } from './api';

const API_ENDPOINT = '/'; // Τα endpoints είναι σχετικά με το baseURL που ορίστηκε στο uploadApi

export const uploadInitialGrades = (formData) =>
    uploadApi.post(`${API_ENDPOINT}/initial`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });