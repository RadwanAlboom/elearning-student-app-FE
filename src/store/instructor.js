import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from './api';
import moment from 'moment';

const slice = createSlice({
    name: 'teachers',
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
                return teacher.id + '' !== action.payload.id;
            });
            teachers.list = newTeachers;
        },
        teacherUpdated: (teachers, action) => {
            const { id, newTeacher } = action.payload;
            const index = teachers.list.findIndex(
                (teacher) => teacher.id + '' === id + ''
            );
            teachers.list[index] = newTeacher;
        },
    },
});

export const {
    teachersReceived,
    teachersRequested,
    teachersRequestFailed,
    teacherDeleted,
    teacherUpdated,
} = slice.actions;
export default slice.reducer;

export const loadTeachers = () => (dispatch, getState) => {
    const { lastFetch } = getState().teachers;
    const diffInMinutes = moment().diff(moment(lastFetch), 'minutes');
    if (diffInMinutes < 0) return;

    return dispatch(
        apiCallBegan({
            url: '/teachers',
            onStart: teachersRequested.type,
            onSuccess: teachersReceived.type,
            onError: teachersRequestFailed.type,
        })
    );
};

export const deleteTeacher = (id) =>
    apiCallBegan({
        url: `/teachers/${id}`,
        method: 'delete',
        onSuccess: teacherDeleted.type,
    });

export const updateTeacher = (id, updatedTeacher) =>
    apiCallBegan({
        url: `/teachers/${id}`,
        method: 'put',
        data: updatedTeacher,
        onSuccess: teacherUpdated.type,
    });
