import http from './httpService';

const apiEndpoint = process.env.REACT_APP_API_URL + '/api/users-unit';

export function getNotAssignedStudentsUnit(unitId, email) {
    return http.get(`${apiEndpoint}/${unitId}/users?email=${email}`);
}
