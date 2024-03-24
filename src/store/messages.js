import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from './api';
import moment from 'moment';

const slice = createSlice({
    name: 'messages',
    initialState: {
        list: [],
        loading: false,
        lastFetch: null,
    },
    reducers: {
        messagesRequested: (messages, action) => {
            messages.loading = true;
        },
        messagesReceived: (messages, action) => {
            messages.list = action.payload;
            messages.loading = false;
            messages.lastFetch = Date.now();
        },
        messagesRequestFailed: (messages, action) => {
            messages.loading = false;
        },

        messageAdded: (messages, action) => {
            messages.list.push(action.payload);
        },
    },
});

export const {
    messagesReceived,
    messagesRequested,
    messagesRequestFailed,
    messageAdded,
} = slice.actions;
export default slice.reducer;

export const loadMessages = (user_id, teacher_id) => (dispatch, getState) => {
    const { lastFetch } = getState().messages;
    const diffInMinutes = moment().diff(moment(lastFetch), 'minutes');
    if (diffInMinutes < 0) return;

    return dispatch(
        apiCallBegan({
            url: `/messages/${user_id}/${teacher_id}`,
            onStart: messagesRequested.type,
            onSuccess: messagesReceived.type,
            onError: messagesRequestFailed.type,
        })
    );
};

export const addMessage = (newMessage) => ({
    type: messageAdded.type,
    payload: newMessage,
});
