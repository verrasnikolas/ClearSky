// src/services/ReviewService.js
import { reviewApi } from './api';

export const submitReview = (review) => reviewApi.post('', review);
export const getAllReviews = () => reviewApi.get('');
export const replyToReview = (data) => reviewApi.patch('/status', data);

/**
 * Get a specific review status for a student & course
 * @param {string} studentId
 * @param {string} courseId
 */
export const getReviewStatus = (studentId, courseId) =>
    reviewApi.get(`/status?student_id=${studentId}&course_id=${courseId}`);

