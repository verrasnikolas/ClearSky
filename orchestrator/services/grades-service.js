// services/grades-service.js
const axios = require('axios');

const uploadGrades = async (fileBuffer) => {
    try {
        const formData = new FormData();
        formData.append('file', new Blob([fileBuffer]), 'grades.xlsx'); // Δημιουργούμε ένα Blob από το buffer

        const response = await axios.post('http://localhost:3001/api/grades/upload', formData, { // Χρησιμοποίησε τη σωστή διεύθυνση και θύρα
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return { status: response.status, data: response.data };

    } catch (error) {
        console.error('Error calling grades-service:', error.response ? error.response.data : error.message);
        return { status: error.response?.status || 500, data: error.response?.data || { error: 'Failed to upload grades' } };
    }
};

module.exports = { uploadGrades };