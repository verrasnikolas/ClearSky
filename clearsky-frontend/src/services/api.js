// src/services/api.js
import axios from 'axios';

const getApiInstance = (baseURL) => {
    const instance = axios.create({
        baseURL: baseURL
    });

    instance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        async (error) => {
            const originalRequest = error.config;

            // Έλεγχος αν το σφάλμα είναι 401 και δεν έχει γίνει ήδη προσπάθεια ανανέωσης
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true; // Σημαδεύουμε την αίτηση για επανάληψη

                try {
                    const refreshToken = localStorage.getItem('refreshToken');
                    if (refreshToken) {
                        const refreshResponse = await axios.post('http://localhost:30035/api/auth/refresh', { refreshToken }); // ⚠️ Χρησιμοποιούμε απευθείας axios εδώ

                        if (refreshResponse.status === 200) {
                            const newAccessToken = refreshResponse.data.accessToken;
                            localStorage.setItem('accessToken', newAccessToken);
                            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                            return axios(originalRequest); // Επαναλαμβάνουμε την αρχική αίτηση με το νέο token
                        } else {
                            // Η ανανέωση απέτυχε, κάνουμε logout τον χρήστη
                            localStorage.removeItem('accessToken');
                            localStorage.removeItem('refreshToken');
                            window.location.href = '/login'; // Ή κάνε dispatch μια action για logout
                        }
                    } else {
                        // Δεν υπάρχει refresh token, κάνουμε logout
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('refreshToken');
                        window.location.href = '/login';
                    }
                } catch (refreshError) {
                    console.error('Error refreshing token:', refreshError);
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/login';
                }
            }

            return Promise.reject(error);
        }
    );

    return instance;
};

const GATEWAY_URL = 'http://localhost:80/api'; // your API Gateway

export const gradeApi = getApiInstance(`${GATEWAY_URL}/grades`);
export const userApi = getApiInstance(`${GATEWAY_URL}/users`);
export const authApi = getApiInstance(`${GATEWAY_URL}/auth`);
export const uploadApi = getApiInstance(`${GATEWAY_URL}/upload`);
export const reviewApi = getApiInstance(`${GATEWAY_URL}/reviews`);
export const statsApi = getApiInstance(`${GATEWAY_URL}/stats`);