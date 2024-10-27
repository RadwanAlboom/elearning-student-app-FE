import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./api";

const slice = createSlice({
    name: "deviceInfo",
    initialState: {
        list: [],
        loading: false,
        lastFetch: null,
    },
    reducers: {
        deviceInfoRequested: (deviceInfo, action) => {
            deviceInfo.loading = true;
        },
        deviceInfoReceived: (deviceInfo, action) => {
            deviceInfo.list = action.payload;
            deviceInfo.loading = false;
            deviceInfo.lastFetch = Date.now();
        },
        deviceInfoRequestFailed: (deviceInfo, action) => {
            deviceInfo.loading = false;
        },
        RESET_DATA: (deviceInfo, action) => {
            deviceInfo.list = [];
        },
    },
});

export const {
    deviceInfoReceived,
    deviceInfoRequested,
    deviceInfoRequestFailed,
    RESET_DATA,
} = slice.actions;
export default slice.reducer;

const resetData = () => ({
    type: RESET_DATA,
});

export const loadDeviceInfo = (userId) => (dispatch, getState) => {
    dispatch(resetData());

    return dispatch(
        apiCallBegan({
            url: `/users/${userId}/device-info`,
            onStart: deviceInfoRequested.type,
            onSuccess: deviceInfoReceived.type,
            onError: deviceInfoRequestFailed.type,
        })
    );
};
