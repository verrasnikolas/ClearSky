// src/services/GradeService.js
import { gradeApi } from './api';

const API_ENDPOINT = ''; // or just remove it

// Get all grades
export const getAllGrades = () => gradeApi.get(API_ENDPOINT);

export const getGradesByUser = (studentId) =>
    gradeApi.get(`/student/${studentId}`);

// src/services/GradeService.js
export const getGradeForStudentCourse = (studentId, courseId) =>
    gradeApi.get(`/student/${studentId}/course/${courseId}`);

export const getCoursesByInstructor = () =>
    gradeApi.get(`/instructor/courses`);

export const getCourseById = (courseId) =>
    gradeApi.get(`/course/${courseId}`);

// Add other grade-related functions as needed...