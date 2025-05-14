import axios from 'axios';

const API_URL = 'http://localhost:30031/api/grades';

// Get all grades
export const getAllGrades = () => axios.get(API_URL);

// Upload grades (if needed)
export const uploadGrades = (formData) =>
    axios.post(`${API_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });

// Get grades by user ID (if your backend supports it)
export const getGradesByUser = (userId) =>
    axios.get(`${API_URL}/student/${userId}`);
