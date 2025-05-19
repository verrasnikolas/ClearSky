// src/services/statsService.js
import axios from 'axios';

const API_URL = 'http://localhost:30032/api/stats/courses';

/**
 * Fetch stats for a specific course & exam period
 * GET /api/stats/courses/:courseCode/:examPeriod
 */
export const getCourseStats = (courseCode, examPeriod) =>
    axios.get(`${API_URL}/${courseCode}/${encodeURIComponent(examPeriod)}`);

/**
 * Fetch stats for all semesters of a course
 * GET /api/stats/courses/:courseCode
 */
export const getAllCourseStats = (courseCode) =>
    axios.get(`${API_URL}/${courseCode}`);
