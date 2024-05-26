import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./api";

const slice = createSlice({
    name: "studentProfile",
    initialState: {
        list: {},
        recevier: {},
        teacher: {},
    },
    reducers: {
        profileReceived: (profile, action) => {
            profile.list = action.payload;
        },
        RESET_DATA: (profile, action) => {
            profile.list = {};
            profile.recevier = {};
            profile.teacher = {};
        },
    },
});

export const { profileReceived, RESET_DATA } = slice.actions;
export default slice.reducer;

const resetData = () => ({
    type: RESET_DATA,
});

export const loadProfile = (userId) => (dispatch, getState) => {
    dispatch(resetData());
    return dispatch(
        apiCallBegan({
            url: `/profile/${userId}`,
            method: "get",
            onSuccess: profileReceived.type,
        })
    );
};
