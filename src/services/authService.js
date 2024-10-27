import jwtDecode from 'jwt-decode';
import http from './httpService';
import getBrowserFingerprint from 'get-browser-fingerprint';
import { isMobile, isTablet, isDesktop } from 'react-device-detect';

let backendURL = process.env.REACT_APP_API_URL;

const tokenKey = 'token';
const reduxToken = 'persist:root';

export async function login(email, password, teacherChecked, major) {
    const fingerprint = getBrowserFingerprint();
    const deviceInfo = getDeviceInfo();
    const { data } = await http.post(backendURL + '/api/auth', {
        email,
        password,
        isModerator: teacherChecked,
        majorId: major,
        fingerprint,
        deviceInfo: {
            fingerprint,
            ...deviceInfo
        }
    });

    localStorage.setItem(tokenKey, data.jwt);
}

function getDeviceInfo() {
    let connection = "";
    if (navigator.connection) {
        connection = navigator.connection.effectiveType;
    }
    return {
        connection,
        platform: navigator.platform,
        productSub: navigator.productSub,
        userAgent: navigator.userAgent,
        userAgentData: navigator.userAgentData,
        isMobile,
        isTablet,
        isDesktop
    }
}

export async function verify(code, email, password, teacherChecked, major) {
    const fingerprint = getBrowserFingerprint();
    const deviceInfo = getDeviceInfo();
    const result = await http.post(backendURL + '/api/auth/verification', {
        code,
        email,
        password,
        isModerator: teacherChecked,
        majorId: major,
        fingerprint,
        deviceInfo: {
            fingerprint,
            ...deviceInfo
        }
    });

    localStorage.setItem(tokenKey, result.data.jwt);
    return result;
}

export async function authMe() {
    await http.post(backendURL + '/api/auth/me', {});
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
    authMe
};

export default exportedObject;
