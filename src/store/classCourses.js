import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from './api';
import moment from 'moment';

const slice = createSlice({
    name: 'classCourses',
    initialState: {
        list: [],
        loading: false,
        lastFetch: null,
    },
    reducers: {
        classCoursesRequested: (classCourses, action) => {
            classCourses.loading = true;
        },
        classCoursesReceived: (classCourses, action) => {
            classCourses.list = action.payload;
            classCourses.loading = false;
            classCourses.lastFetch = Date.now();
        },
        classCoursesRequestFailed: (classCourses, action) => {
            classCourses.loading = false;
        },

        // command - event
        // addAdminCourse - adminCourseAdded
        classCourseAdded: (classCourses, action) => {
            classCourses.list.push(action.payload);
        },
        classCourseDeleted: (classCourses, action) => {
            const newClassCourses = classCourses.list.filter((classCourse) => {
                return classCourse.id + '' !== action.payload.id;
            });
            classCourses.list = newClassCourses;
        },
        classCourseUpdated: (classCourses, action) => {
            const { id, newClassCourse } = action.payload;
            const index = classCourses.list.findIndex(
                (course) => course.id + '' === id
            );
            classCourses.list[index] = newClassCourse;
        },
    },
});

export const {
    classCoursesReceived,
    classCoursesRequested,
    classCoursesRequestFailed,
    classCourseAdded,
    classCourseDeleted,
    classCourseUpdated,
} = slice.actions;
export default slice.reducer;

const url = '/courses/teachers/classCourses';

export const loadClassCourses = () => (dispatch, getState) => {
    const { lastFetch } = getState().entities.classCourses;
    const diffInMinutes = moment().diff(moment(lastFetch), 'minutes');
    if (diffInMinutes < 0) return;

    return dispatch(
        apiCallBegan({
            url,
            onStart: classCoursesRequested.type,
            onSuccess: classCoursesReceived.type,
            onError: classCoursesRequestFailed.type,
        })
    );
};

export const addClassCourse = (classCourses, courseId, teacherId) =>
    apiCallBegan({
        url: `/courses/${courseId}/teachers/${teacherId}/classCourses`,
        method: 'post',
        name: 'classCourses',
        data: classCourses,
        onSuccess: classCourseAdded.type,
    });

export const deleteClassCourse = (id) =>
    apiCallBegan({
        url: `/courses/classCourses/${id}`,
        method: 'delete',
        name: 'classCourses',
        onSuccess: classCourseDeleted.type,
    });

export const updateClassCourse = (id, updateClassCourse) =>
    apiCallBegan({
        url: `/courses/classCourses/${id}`,
        method: 'put',
        name: 'classCourses',
        data: updateClassCourse,
        onSuccess: classCourseUpdated.type,
    });
