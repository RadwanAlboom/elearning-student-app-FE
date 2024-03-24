import http from '../../services/httpService';
import socketIOClient from 'socket.io-client';
import * as actions from '../api';

let backendURL = process.env.REACT_APP_API_URL;
let socket;

const api =
    ({ dispatch }) =>
    (next) =>
    async (action) => {
        if (action.type !== actions.apiCallBegan.type) return next(action);

        const { url, method, data, onSuccess } = action.payload;

        next(action);

        try {
            const response = await http.request({
                baseURL: backendURL + '/api',
                url,
                method,
                data,
            });

            // General
            dispatch(actions.apiCallSuccess(response.data));
            // Specific
            if (onSuccess)
                dispatch({ type: onSuccess, payload: response.data });

            if (action.payload.method) {
                socket = socketIOClient(backendURL);
                socket.emit(
                    `${action.payload.name}`,
                    { payload: response.data },
                    (error) => {}
                );
            }
        } catch (error) {
            // General
            dispatch(actions.apiCallFailed(error.message));
        }
    };

export default api;
