import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from './api';
import moment from 'moment';

const slice = createSlice({
    name: 'exams',
    initialState: {
        list: [],
        loading: false,
        lastFetch: null,
    },
    reducers: {
        examsRequested: (exams, action) => {
            exams.loading = true;
        },
        examsReceived: (exams, action) => {
            exams.list = action.payload;
            exams.loading = false;
            exams.lastFetch = Date.now();
        },
        examsRequestFailed: (exams, action) => {
            exams.loading = false;
        },

        examDeleted: (exams, action) => {
            const newUExams = exams.list.filter((exam) => {
                return exam.id + '' !== action.payload.id;
            });
            exams.list = newUExams;
        },
        RESET_DATA: (exams, action) => {
            exams.list = [];
        },
    },
});

export const {
    examsReceived,
    examsRequested,
    examsRequestFailed,
    examDeleted,
    RESET_DATA,
} = slice.actions;
export default slice.reducer;

const resetData = () => ({
    type: RESET_DATA,
});

export const loadExams = (chapterId) => (dispatch, getState) => {
    const { lastFetch } = getState().entities.exams;
    const diffInMinutes = moment().diff(moment(lastFetch), 'minutes');
    if (diffInMinutes < 0) return;
    dispatch(resetData());

    return dispatch(
        apiCallBegan({
            url: `/courses/exams?unitId=${chapterId}`,
            onStart: examsRequested.type,
            onSuccess: examsReceived.type,
            onError: examsRequestFailed.type,
        })
    );
};

export const deleteExam = (id) =>
    apiCallBegan({
        url: `/form/exams/${id}`,
        method: 'delete',
        name: 'exams',
        onSuccess: examDeleted.type,
    });
