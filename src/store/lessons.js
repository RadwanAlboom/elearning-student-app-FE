import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from './api';
import moment from 'moment';

const slice = createSlice({
    name: 'lessons',
    initialState: {
        list: [],
        loading: false,
        lastFetch: null,
    },
    reducers: {
        lessonsRequested: (lessons, action) => {
            lessons.loading = true;
        },
        lessonsReceived: (lessons, action) => {
            lessons.list = action.payload;
            lessons.loading = false;
            lessons.lastFetch = Date.now();
        },
        lessonsRequestFailed: (lessons, action) => {
            lessons.loading = false;
        },

        lessonAdded: (lessons, action) => {
            lessons.list.push(action.payload);
        },
        lessonDeleted: (lessons, action) => {
            const newLessons = lessons.list.filter((lesson) => {
                return lesson.id + '' !== action.payload.id;
            });
            lessons.list = newLessons;
        },
        lessonUpdated: (lessons, action) => {
            const { id, newLesson } = action.payload;
            const index = lessons.list.findIndex(
                (lesson) => lesson.id + '' === id
            );
            lessons.list[index] = newLesson;
        },
    },
});

export const {
    lessonsReceived,
    lessonsRequested,
    lessonsRequestFailed,
    lessonAdded,
    lessonDeleted,
    lessonUpdated,
} = slice.actions;
export default slice.reducer;

export const loadLessons = () => (dispatch, getState) => {
    const { lastFetch } = getState().entities.lessons;
    const diffInMinutes = moment().diff(moment(lastFetch), 'minutes');
    if (diffInMinutes < 0) return;

    return dispatch(
        apiCallBegan({
            url: '/courses/lessons',
            onStart: lessonsRequested.type,
            onSuccess: lessonsReceived.type,
            onError: lessonsRequestFailed.type,
        })
    );
};

export const addLesson = (newLesson, chapterId) =>
    apiCallBegan({
        url: `/courses/lessons/${chapterId}`,
        method: 'post',
        name: 'lessons',
        data: newLesson,
        onSuccess: lessonAdded.type,
    });

export const deleteLesson = (id) =>
    apiCallBegan({
        url: `/courses/lessons/${id}`,
        method: 'delete',
        name: 'lessons',
        onSuccess: lessonDeleted.type,
    });

export const updateLesson = (id, updatedLesson) =>
    apiCallBegan({
        url: `/courses/lessons/${id}`,
        method: 'put',
        name: 'lessons',
        data: updatedLesson,
        onSuccess: lessonUpdated.type,
    });
