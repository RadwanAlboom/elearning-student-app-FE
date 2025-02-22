import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./api";
import moment from "moment";

const slice = createSlice({
    name: "requests",
    initialState: {
        list: [],
        pagination: {
            page: 0,
            totalPages: 0,
            totalUserRequests: 0,
            limit: 10,
        },
        loading: false,
        lastFetch: null,
    },
    reducers: {
        requestsRequested: (requests, action) => {
            requests.loading = true;
        },
        requestsReceived: (requests, action) => {
            requests.list = action.payload.data;
            requests.pagination = action.payload.pagination;
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
                return request.id + "" !== action.payload.id;
            });
            requests.list = newRequests;
        },
        requestAccepted: (requests, action) => {
            const { id, newRequest } = action.payload;
            const index = requests.list.findIndex(
                (request) => request.id + "" === id
            );
            requests.list[index] = newRequest;
        },
        RESET_DATA: (requests, action) => {
            requests.list = [];
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
    RESET_DATA,
} = slice.actions;
export default slice.reducer;

const resetData = () => ({
    type: RESET_DATA,
});

export const loadRequests = (page, limit, emailFilter) => (dispatch, getState) => {
    const { lastFetch } = getState().requests;
    const diffInMinutes = moment().diff(moment(lastFetch), "minutes");
    if (diffInMinutes < 0) return;
    dispatch(resetData());

    return dispatch(
        apiCallBegan({
            url: `/userRequest?${new URLSearchParams({ email: emailFilter, page, limit }).toString()}`,
            onStart: requestsRequested.type,
            onSuccess: requestsReceived.type,
            onError: requestsRequestFailed.type,
        })
    );
};

export const addRequest = (newRequest) =>
    apiCallBegan({
        url: `/userRequest/request`,
        method: "post",
        name: "requests",
        data: newRequest,
        onSuccess: requestAdded.type,
    });

export const deleteRequest = (id) => (dispatch, getState) => {
    return dispatch(
        apiCallBegan({
            url: `/userRequest/${id}`,
            method: "delete",
            name: "requests",
            onSuccess: requestDeleted.type,
        })
    )
}

export const acceptRequest = (id) => (dispatch, getState) => {
    return dispatch(
        apiCallBegan({
            url: `/userRequest/${id}`,
            method: "put",
            name: "requests",
            onSuccess: requestAccepted.type,
        })
    );
}
