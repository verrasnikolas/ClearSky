import { userApi } from './api';

/**
 * Create a new user.
 * payload: { email, name, academicId, password, role }
 */
export function createUser(payload) {
    return userApi.post('/', payload); // correct usage of instance
}

/**
 * Change password for an existing user.
 * id: user DB id or academic ID (depends on your routing).
 * payload: { newPassword }
 */
export function changePassword(id, payload) {
    return userApi.patch(`/${id}/password`, payload); // fixed template literal
}

// export function getUserByAcademicId(academicId) {
//     return userApi.get(`/users/academic/${academicId}`);
// }
//
// export function getUserByUsername(username) {
//     return userApi.get(`/users/username/${username}`);
// }
