// src/services/ReviewService.js
import { reviewApi } from './api';

const API_ENDPOINT = '/'; // Τα endpoints είναι σχετικά με το baseURL που ορίστηκε στο reviewApi

export const submitReview = (review) => reviewApi.post(API_ENDPOINT, review);

export const getAllReviews = () => reviewApi.get(API_ENDPOINT);

export const replyToReview = (id, data) => reviewApi.patch(`/${id}`, data);