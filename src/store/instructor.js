import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./api";
import moment from "moment";

const slice = createSlice({
    name: "teachers",
    initialState: {
        list: [],
        loading: false,
        lastFetch: null,
    },
    reducers: {
        teachersRequested: (teachers, action) => {
            teachers.loading = true;
        },
        teachersReceived: (teachers, action) => {
            teachers.list = action.payload;
            teachers.loading = false;
            teachers.lastFetch = Date.now();
        },
        teachersRequestFailed: (teachers, action) => {
            teachers.loading = false;
        },

        teacherDeleted: (teachers, action) => {
            const newTeachers = teachers.list.filter((teacher) => {
                return teacher.id + "" !== action.payload.id;
            });
            teachers.list = newTeachers;
        },
        teacherUpdated: (teachers, action) => {
            const { id, newTeacher } = action.payload;
            const index = teachers.list.findIndex(
                (teacher) => teacher.id + "" === id + ""
            );
            teachers.list[index] = newTeacher;
        },
        RESET_DATA: (teachers, action) => {
            teachers.list = [];
        },
    },
});

export const {
    teachersReceived,
    teachersRequested,
    teachersRequestFailed,
    teacherDeleted,
    teacherUpdated,
    RESET_DATA
} = slice.actions;
export default slice.reducer;

const resetData = () => ({
    type: RESET_DATA,
});

export const loadTeachers = (emailFilter) => (dispatch, getState) => {
    const { lastFetch } = getState().teachers;
    const diffInMinutes = moment().diff(moment(lastFetch), "minutes");
    if (diffInMinutes < 0) return;
    dispatch(resetData());

    return dispatch(
        apiCallBegan({
            url: `/teachers?email=${emailFilter}`,
            onStart: teachersRequested.type,
            onSuccess: teachersReceived.type,
            onError: teachersRequestFailed.type,
        })
    );
};

export const loadTeam = () => (dispatch, getState) => {
    dispatch(resetData());
    return dispatch(
        apiCallBegan({
            url: `/teachers/team`,
            onStart: teachersRequested.type,
            onSuccess: teachersReceived.type,
            onError: teachersRequestFailed.type,
        })
    );
};

export const deleteTeacher = (id) =>
    apiCallBegan({
        url: `/teachers/${id}`,
        method: "delete",
        onSuccess: teacherDeleted.type,
    });

export const updateTeacher = (id, updatedTeacher) =>
    apiCallBegan({
        url: `/teachers/${id}`,
        method: "put",
        data: updatedTeacher,
        onSuccess: teacherUpdated.type,
    });

export const updateTeacherBlockStatus = (id, isBlock) =>
    apiCallBegan({
        url: `/teachers/block/${id}`,
        method: "put",
        data: { isBlock },
        onSuccess: teacherUpdated.type,
    });
