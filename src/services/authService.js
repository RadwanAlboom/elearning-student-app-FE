import jwtDecode from 'jwt-decode';
import http from './httpService';
import getBrowserFingerprint from 'get-browser-fingerprint';

let backendURL = process.env.REACT_APP_API_URL;

const tokenKey = 'token';
const reduxToken = 'persist:root';

export async function login(email, password, teacherChecked, major) {
    const fingerprint = getBrowserFingerprint();
    const { data } = await http.post(backendURL + '/api/auth', {
        email,
        password,
        isModerator: teacherChecked,
        majorId: major,
        fingerprint
    });

    localStorage.setItem(tokenKey, data.jwt);
}

export async function verify(code, email, password, teacherChecked, major) {
    const fingerprint = getBrowserFingerprint();
    const result = await http.post(backendURL + '/api/auth/verification', {
        code,
        email,
        password,
        isModerator: teacherChecked,
        majorId: major,
        fingerprint
    });

    localStorage.setItem(tokenKey, result.data.jwt);
    return result;
}

export function loginWithJwt(jwt) {
    localStorage.setItem(tokenKey, jwt);
}

export function getCurrentUser() {
    try {
        const jwt = localStorage.getItem(tokenKey);
        return jwtDecode(jwt);
    } catch (ex) {
        return null;
    }
}

export function logout() {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(reduxToken);
}

export function getJwt() {
    return localStorage.getItem(tokenKey);
}

const exportedObject = {
    login,
    verify,
    loginWithJwt,
    getCurrentUser,
    logout,
};

export default exportedObject;
