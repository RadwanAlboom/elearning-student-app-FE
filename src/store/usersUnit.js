import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./api";

const slice = createSlice({
    name: "usersUnit",
    initialState: {
        list: [],
        loading: false,
        lastFetch: null,
    },
    reducers: {
        usersUnitRequested: (usersUnit, action) => {
            usersUnit.loading = true;
        },
        specificUsersUnitReceived: (usersUnit, action) => {
            usersUnit.list = action.payload;
            usersUnit.loading = false;
            usersUnit.lastFetch = Date.now();
        },
        usersUnitRequestFailed: (usersUnit, action) => {
            usersUnit.loading = false;
        },
        usersUnitAdded: (usersUnit, action) => {
            usersUnit.list.unshift(action.payload);
        },
        usersUnitDeleted: (usersUnit, action) => {
            const newUsersUnit = usersUnit.list.filter((userUnit) => {
                return userUnit.id !== action.payload.id;
            });
            usersUnit.list = newUsersUnit;
        },
        RESET_DATA: (usersUnit, action) => {
            usersUnit.list = [];
        },
    },
});

export const {
    specificUsersUnitReceived,
    usersUnitRequested,
    usersUnitRequestFailed,
    usersUnitAdded,
    usersUnitDeleted,
    RESET_DATA,
} = slice.actions;
export default slice.reducer;

const resetData = () => ({
    type: RESET_DATA,
});

export const loadSpecificUsersUnit = (unitId) => (dispatch, getState) => {
    dispatch(resetData());
    return dispatch(
        apiCallBegan({
            url: `/users-unit/${unitId}`,
            onStart: usersUnitRequested.type,
            onSuccess: specificUsersUnitReceived.type,
            onError: usersUnitRequestFailed.type,
        })
    );
};

export const loadAssignedUsersUnit =
    (unitId, email) => (dispatch, getState) => {
        dispatch(resetData());
        return dispatch(
            apiCallBegan({
                url: `/users-unit/${unitId}/assigned-users?email=${email}`,
                onStart: usersUnitRequested.type,
                onSuccess: specificUsersUnitReceived.type,
                onError: usersUnitRequestFailed.type,
            })
        );
    };

export const addUserToUnit = (userId, unitId, paymentAmount) =>
    apiCallBegan({
        url: `/users-unit/users`,
        method: "post",
        name: "usersUnit",
        data: { userId, unitId, paymentAmount },
        onSuccess: usersUnitAdded.type,
    });

export const deleteUserFromUnit = (userId, unitId) =>
    apiCallBegan({
        url: `/users-unit/users`,
        method: "delete",
        name: "usersUnit",
        data: { userId, unitId },
        onSuccess: usersUnitDeleted.type,
    });
