import axios from 'axios';

const API_URL = 'http://localhost:3003/api/reviews';

export const submitReview = (review) => axios.post(API_URL, review);

export const getAllReviews = () => axios.get(API_URL);

export const replyToReview = (id, data) => axios.patch(`${API_URL}/${id}`, data);
