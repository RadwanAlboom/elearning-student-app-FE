import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from './api';
import moment from 'moment';

const slice = createSlice({
    name: 'students',
    initialState: {
        list: [],
        loading: false,
        lastFetch: null,
    },
    reducers: {
        studentsRequested: (students, action) => {
            students.loading = true;
        },
        studentsReceived: (students, action) => {
            students.list = action.payload;
            students.loading = false;
            students.lastFetch = Date.now();
        },
        studentsRequestFailed: (students, action) => {
            students.loading = false;
        },

        studentDeleted: (students, action) => {
            const newStudents = students.list.filter((student) => {
                return student.id + '' !== action.payload.id;
            });
            students.list = newStudents;
        },
        studentUpdated: (students, action) => {
            const { id, newStudent } = action.payload;
            const index = students.list.findIndex(
                (student) => student.id + '' === id + ''
            );
            students.list[index] = newStudent;
        },
    },
});

export const {
    studentsReceived,
    studentsRequested,
    studentsRequestFailed,
    studentDeleted,
    studentUpdated,
} = slice.actions;
export default slice.reducer;

export const loadStudents = () => (dispatch, getState) => {
    const { lastFetch } = getState().students;
    const diffInMinutes = moment().diff(moment(lastFetch), 'minutes');
    if (diffInMinutes < 0) return;

    return dispatch(
        apiCallBegan({
            url: '/users',
            onStart: studentsRequested.type,
            onSuccess: studentsReceived.type,
            onError: studentsRequestFailed.type,
        })
    );
};

export const deleteStudent = (id) =>
    apiCallBegan({
        url: `/users/${id}`,
        method: 'delete',
        onSuccess: studentDeleted.type,
    });

export const updateStudent = (id, updatedStudent) =>
    apiCallBegan({
        url: `/users/${id}`,
        method: 'put',
        data: updatedStudent,
        onSuccess: studentUpdated.type,
    });
