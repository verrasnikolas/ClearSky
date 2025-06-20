// services/AuthService.js
import { authApi } from './api';

export function login({ identifier, password }) {
    return authApi.post('/login', { identifier, password });
}
