// src/services/GradeService.js
import { gradeApi } from './api';

const API_ENDPOINT = ''; // or just remove it

// Get all grades
export const getAllGrades = () => gradeApi.get(API_ENDPOINT);

// Get grades by user ID
export const getGradesByUser = (userId) => gradeApi.get(`/student/${userId}`);

// src/services/GradeService.js
export const getGradeForStudentCourse = (studentId, courseId) =>
    gradeApi.get(`/student/${studentId}/course/${courseId}`);


// Add other grade-related functions as needed...
