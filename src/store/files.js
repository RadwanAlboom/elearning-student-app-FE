import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from './api';
import moment from 'moment';

const slice = createSlice({
    name: 'files',
    initialState: {
        list: [],
        loading: false,
        lastFetch: null,
    },
    reducers: {
        filesRequested: (files, action) => {
            files.loading = true;
        },
        filesReceived: (files, action) => {
            files.list = action.payload;
            files.loading = false;
            files.lastFetch = Date.now();
        },
        filesRequestFailed: (files, action) => {
            files.loading = false;
        },

        fileAdded: (files, action) => {
            files.list.push(action.payload);
        },
        fileDeleted: (files, action) => {
            const newFiles = files.list.filter((file) => {
                return file.id + '' !== action.payload.id;
            });
            files.list = newFiles;
        },
        fileUpdated: (files, action) => {
            const { id, newFile } = action.payload;
            const index = files.list.findIndex((file) => file.id + '' === id);
            files.list[index] = newFile;
        },
    },
});

export const {
    filesReceived,
    filesRequested,
    filesRequestFailed,
    fileAdded,
    fileDeleted,
    fileUpdated,
} = slice.actions;
export default slice.reducer;

export const loadFiles = () => (dispatch, getState) => {
    const { lastFetch } = getState().entities.files;
    const diffInMinutes = moment().diff(moment(lastFetch), 'minutes');
    if (diffInMinutes < 0) return;

    return dispatch(
        apiCallBegan({
            url: '/courses/files',
            onStart: filesRequested.type,
            onSuccess: filesReceived.type,
            onError: filesRequestFailed.type,
        })
    );
};

export const addFile = (newFile, chapterId) =>
    apiCallBegan({
        url: `/courses/files/${chapterId}`,
        method: 'post',
        name: 'files',
        data: newFile,
        onSuccess: fileAdded.type,
    });

export const deleteFile = (id) =>
    apiCallBegan({
        url: `/courses/files/${id}`,
        method: 'delete',
        name: 'files',
        onSuccess: fileDeleted.type,
    });

export const updateFile = (id, updatedFile) =>
    apiCallBegan({
        url: `/courses/files/${id}`,
        method: 'put',
        name: 'files',
        data: updatedFile,
        onSuccess: fileUpdated.type,
    });
