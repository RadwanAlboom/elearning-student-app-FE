import http from './httpService';
const apiEndpoint = process.env.REACT_APP_API_URL + '/api/form';

export function autoSave(name, description, questions, successRate, API_URL) {
    return http.post(apiEndpoint + API_URL, {
        name,
        description,
        questions,
        successRate,
    });
}
export function editForm(name, description, questions, successRate, API_URL) {
    return http.put(apiEndpoint + API_URL, {
        name,
        description,
        questions,
        successRate,
    });
}

export function submitForm(
    name,
    description,
    questions,
    teacherId,
    studentName,
    API_URL
) {
    return http.put(apiEndpoint + API_URL, {
        name,
        description,
        questions,
        teacherId,
        studentName,
    });
}
