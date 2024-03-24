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
    },
});

export const {
    examsReceived,
    examsRequested,
    examsRequestFailed,
    examDeleted,
} = slice.actions;
export default slice.reducer;

export const loadExams = () => (dispatch, getState) => {
    const { lastFetch } = getState().entities.exams;
    const diffInMinutes = moment().diff(moment(lastFetch), 'minutes');
    if (diffInMinutes < 0) return;

    return dispatch(
        apiCallBegan({
            url: '/courses/exams',
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
