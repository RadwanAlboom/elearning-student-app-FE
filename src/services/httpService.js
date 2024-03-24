import axios from 'axios';
import logger from './logService';
import { toast } from 'react-toastify';

const tokenKey = 'token';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.interceptors.response.use(null, (error) => {
    if (error.response && error.response.status === 401) {
        localStorage.removeItem(tokenKey);
        window.location = '/registration';
    }
    //Handling unexpected errors
    const expectedError =
        error.response &&
        error.response.status >= 400 &&
        error.response.status < 500;

    if (!expectedError) {
        logger.log(error);
        toast.error('An unexpected error occurred.');
    }

    return Promise.reject(error);
});

axios.interceptors.request.use(
    function (config) {
        const jwt = localStorage.getItem(tokenKey);
        config.headers.Authorization = jwt;
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

const exportedObject = {
    get: axios.get,
    post: axios.post,
    put: axios.put,
    delete: axios.delete,
    request: axios.request,
};

export default exportedObject;
