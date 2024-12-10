import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./api";
import moment from "moment";

const slice = createSlice({
    name: "students",
    initialState: {
        list: [],
        pagination: {
            page: 0,
            totalPages: 0,
            totalUsers: 0,
            limit: 10,
        },
        loading: false,
        lastFetch: null,
    },
    reducers: {
        studentsRequested: (students, action) => {
            students.loading = true;
        },
        studentsReceived: (students, action) => {
            students.list = action.payload.data;
            students.pagination = action.payload.pagination;
            students.loading = false;
            students.lastFetch = Date.now();
        },
        studentsRequestFailed: (students, action) => {
            students.loading = false;
        },

        studentDeleted: (students, action) => {
            const newStudents = students.list.filter((student) => {
                return student.id + "" !== action.payload.id;
            });
            students.list = newStudents;
        },
        studentUpdated: (students, action) => {
            const { id, newStudent } = action.payload;
            const index = students.list.findIndex(
                (student) => student.id + "" === id + ""
            );
            students.list[index] = newStudent;
        },
        RESET_DATA: (students, action) => {
            students.list = [];
        },
    },
});

export const {
    studentsReceived,
    studentsRequested,
    studentsRequestFailed,
    studentDeleted,
    studentUpdated,
    RESET_DATA,
} = slice.actions;
export default slice.reducer;

const resetData = () => ({
    type: RESET_DATA,
});

export const loadStudents = (page, limit, emailFilter) => (dispatch, getState) => {
    const { lastFetch } = getState().students;
    const diffInMinutes = moment().diff(moment(lastFetch), "minutes");
    if (diffInMinutes < 0) return;
    dispatch(resetData());

    return dispatch(
        apiCallBegan({
            url: `/users?${new URLSearchParams({ email: emailFilter, page, limit }).toString()}`,
            onStart: studentsRequested.type,
            onSuccess: studentsReceived.type,
            onError: studentsRequestFailed.type,
        })
    );
};

export const deleteStudent = (id) => (dispatch, getState) => {
    return dispatch(
        apiCallBegan({
            url: `/users/${id}`,
            method: "delete",
            onSuccess: studentDeleted.type,
        })
    );
}

export const updateStudent = (id, updatedStudent) =>
    apiCallBegan({
        url: `/users/${id}`,
        method: "put",
        data: updatedStudent,
        onSuccess: studentUpdated.type,
    });

export const updateStudentBlockStatus = (id, isBlock) =>
    apiCallBegan({
        url: `/users/block/${id}`,
        method: "put",
        data: { isBlock },
        onSuccess: studentUpdated.type,
    });
