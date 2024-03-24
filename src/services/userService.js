import http from './httpService';

const apiEndpoint = process.env.REACT_APP_API_URL + '/api/userRequest';

export function register(user, major, teacherChecked) {
    return http.post(apiEndpoint, {
        name: user.registerName,
        email: user.registerEmail,
        password: user.registerPassword,
        isModerator: teacherChecked,
        majorId: major,
    });
}
