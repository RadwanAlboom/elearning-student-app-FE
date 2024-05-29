import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./api";

const slice = createSlice({
    name: "studentProfile",
    initialState: {
        list: {},
    },
    reducers: {
        profileReceived: (studentProfile, action) => {
            studentProfile.list = action.payload;
        },
        RESET_DATA: (studentProfile, action) => {
            studentProfile.list = {};
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
