import { jwtDecode } from 'jwt-decode';

export const decodeToken = (token) => {
    if (!token) return null;
    try {
        return jwtDecode(token);
    } catch {
        return null;
    }
};

export const isTokenExpired = (token) => {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    const now = Date.now() / 1000;
    return decoded.exp < now;
};
