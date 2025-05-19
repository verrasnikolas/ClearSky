// src/services/GradeService.js
import { gradeApi } from './api';

const API_ENDPOINT = '/'; // Τα endpoints είναι σχετικά με το baseURL που ορίστηκε στο gradeApi

// Get all grades
export const getAllGrades = () => gradeApi.get(API_ENDPOINT);

// Get grades by user ID
export const getGradesByUser = (userId) => gradeApi.get(`/student/${userId}`);

// ... άλλες λειτουργίες που αφορούν τα grades