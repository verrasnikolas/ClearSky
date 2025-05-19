import axios from 'axios';

const API_BASE = 'http://localhost:3005/users';  // Adjust to match your actual backend

/**
 * Create a new user.
 * payload: { email, name, academicId, password, role }
 */
export function createUser(payload) {
    return axios.post(API_BASE, payload);
}

/**
 * Change password for an existing user.
 * id: user DB id or academic ID (depends on your routing).
 * payload: { newPassword }
 */
export function changePassword(id, payload) {
    return axios.patch(`${API_BASE}/${id}/password`, payload);
}
