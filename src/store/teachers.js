import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from './api';
import { createSelector } from 'reselect';
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

        // command - event
        // addAdminCourse - adminCourseAdded
        teacherAdded: (teachers, action) => {
            teachers.list.push(action.payload);
        },
    },
});

export const {
    teachersRequested,
    teachersReceived,
    teachersRequestFailed,
    teacherAdded,
} = slice.actions;
export default slice.reducer;

const url = '/courses/teachers';

export const loadTeachers = () => (dispatch, getState) => {
    const { lastFetch } = getState().entities.teachers;
    const diffInMinutes = moment().diff(moment(lastFetch), 'minutes');
    if (diffInMinutes < 0) return;

    return dispatch(
        apiCallBegan({
            url,
            onStart: teachersRequested.type,
            onSuccess: teachersReceived.type,
            onError: teachersRequestFailed.type,
        })
    );
};

export const addTeacher = (teacher) =>
    apiCallBegan({
        url: '/userRequest/',
        method: 'post',
        data: teacher,
        onSuccess: teacherAdded.type,
    });

export const getTeachers = (id) =>
    createSelector(
        (state) => state.entities.teachers,
        (teachers) =>
            teachers.list.filter(
                (teacher) => teacher.course_id + '' === id + ''
            )
    );
