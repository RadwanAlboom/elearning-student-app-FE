import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from './api';
import moment from 'moment';

const slice = createSlice({
    name: 'requests',
    initialState: {
        list: [],
        loading: false,
        lastFetch: null,
    },
    reducers: {
        requestsRequested: (requests, action) => {
            requests.loading = true;
        },
        requestsReceived: (requests, action) => {
            requests.list = action.payload;
            requests.loading = false;
            requests.lastFetch = Date.now();
        },
        requestsRequestFailed: (requests, action) => {
            requests.loading = false;
        },

        requestAdded: (requests, action) => {
            requests.list.push(action.payload);
        },
        requestDeleted: (requests, action) => {
            const newRequests = requests.list.filter((request) => {
                return request.id + '' !== action.payload.id;
            });
            requests.list = newRequests;
        },
        requestAccepted: (requests, action) => {
            const { id, newRequest } = action.payload;
            const index = requests.list.findIndex(
                (request) => request.id + '' === id
            );
            requests.list[index] = newRequest;
        },
    },
});

export const {
    requestsReceived,
    requestsRequested,
    requestsRequestFailed,
    requestAdded,
    requestDeleted,
    requestAccepted,
} = slice.actions;
export default slice.reducer;

export const loadRequests = () => (dispatch, getState) => {
    const { lastFetch } = getState().requests;
    const diffInMinutes = moment().diff(moment(lastFetch), 'minutes');
    if (diffInMinutes < 0) return;

    return dispatch(
        apiCallBegan({
            url: '/userRequest',
            onStart: requestsRequested.type,
            onSuccess: requestsReceived.type,
            onError: requestsRequestFailed.type,
        })
    );
};

export const addRequest = (newRequest) =>
    apiCallBegan({
        url: `/userRequest/request`,
        method: 'post',
        name: 'requests',
        data: newRequest,
        onSuccess: requestAdded.type,
    });

export const deleteRequest = (id) =>
    apiCallBegan({
        url: `/userRequest/${id}`,
        method: 'delete',
        name: 'requests',
        onSuccess: requestDeleted.type,
    });

export const acceptRequest = (id) =>
    apiCallBegan({
        url: `/userRequest/${id}`,
        method: 'put',
        name: 'requests',
        onSuccess: requestAccepted.type,
    });
