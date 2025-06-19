// src/services/statsService.js
import { statsApi } from './api';

export const getCourseStats = (courseCode, examPeriod) =>
    statsApi.get(`/courses/${courseCode}/${encodeURIComponent(examPeriod)}`);

export const getAllCourses = () =>
    statsApi.get('/all-courses');

export const getAllCourseStats = (courseCode) =>
    statsApi.get(`/courses//${courseCode}`);
