import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./api";
import moment from "moment";

const slice = createSlice({
    name: "team",
    initialState: {
        list: [],
        loading: false,
        lastFetch: null,
    },
    reducers: {
        teamRequested: (team, action) => {
            team.loading = true;
        },
        teamReceived: (team, action) => {
            team.list = action.payload;
            team.loading = false;
            team.lastFetch = Date.now();
        },
        teamRequestFailed: (team, action) => {
            team.loading = false;
        },
        RESET_DATA: (team, action) => {
            team.list = [];
        },
    },
});

export const {
    teamReceived,
    teamRequested,
    teamRequestFailed,
    RESET_DATA
} = slice.actions;
export default slice.reducer;

const resetData = () => ({
    type: RESET_DATA,
});

export const loadTeam = () => (dispatch, getState) => {
    const { lastFetch } = getState().teachers;
    const diffInMinutes = moment().diff(moment(lastFetch), "minutes");
    if (diffInMinutes < 0) return;
    dispatch(resetData());

    return dispatch(
        apiCallBegan({
            url: `/teachers/team`,
            onStart: teamRequested.type,
            onSuccess: teamReceived.type,
            onError: teamRequestFailed.type,
        })
    );
};

