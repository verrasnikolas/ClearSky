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

// ... (οι ορισμοί των userApi, gradeApi, κ.λπ.) ...

// Instances για κάθε microservice
export const userApi = getApiInstance('http://localhost:30035');       // User Service
export const gradeApi = getApiInstance('http://localhost:30031/api/grades'); // Grade Service
export const uploadApi = getApiInstance('http://localhost:30036/api/upload'); // Upload Service
export const reviewApi = getApiInstance('http://localhost:30003/api/reviews'); // Review Service
// Προσθέστε και άλλα APIs για κάθε microservice σας