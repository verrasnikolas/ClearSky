import { decodeToken } from './token';
import { userApi } from '../services/api';

export const tryToRefreshToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return null;

    try {
        const response = await userApi.post('/auth/refresh', { refreshToken });
        const newAccessToken = response.data.accessToken;
        localStorage.setItem('accessToken', newAccessToken);
        return decodeToken(newAccessToken); // Return decoded user info
    } catch (err) {
        console.error('❌ Token refresh failed:', err);
        return null;
    }
};
