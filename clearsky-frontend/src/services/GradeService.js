// src/services/GradeService.js
import { gradeApi } from './api';

const API_ENDPOINT = ''; // or just remove it

// Get all grades
export const getAllGrades = () => gradeApi.get(API_ENDPOINT);

// Get grades by user ID
export const getGradesByUser = () => gradeApi.get(`/student`);

// src/services/GradeService.js
export const getGradeForStudentCourse = (courseId) =>
    gradeApi.get(`/student/course/${courseId}`);


// Add other grade-related functions as needed...
