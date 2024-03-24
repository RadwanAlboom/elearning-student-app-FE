import jwtDecode from 'jwt-decode';
import http from './httpService';

let backendURL = process.env.REACT_APP_API_URL;

const tokenKey = 'token';
const reduxToken = 'persist:root';

export async function login(email, password, teacherChecked, major) {
    const { data } = await http.post(backendURL + '/api/auth', {
        email,
        password,
        isModerator: teacherChecked,
        majorId: major,
    });

    localStorage.setItem(tokenKey, data.jwt);
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
    loginWithJwt,
    getCurrentUser,
    logout,
};

export default exportedObject;
