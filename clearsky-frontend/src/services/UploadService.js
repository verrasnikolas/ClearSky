import axios from 'axios';

// ✅ Εδώ βάζεις το σωστό host/port του upload microservice
const API_URL = 'http://localhost:30036/api/upload'; // Ή docker service name:port

export const uploadInitialGrades = (formData) =>
    axios.post(`${API_URL}/initial`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
