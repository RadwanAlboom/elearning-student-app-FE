import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from './api';
import moment from 'moment';

const slice = createSlice({
    name: 'chats',
    initialState: {
        list: [],
        loading: false,
        lastFetch: null,
    },
    reducers: {
        chatsRequested: (chats, action) => {
            chats.loading = true;
        },
        chatsReceived: (chats, action) => {
            chats.list = action.payload;
            chats.loading = false;
            chats.lastFetch = Date.now();
        },
        chatsRequestFailed: (chats, action) => {
            chats.loading = false;
        },

        chatAdded: (chats, action) => {
            !chats.list.some((chat) => chat.id === action.payload.id) &&
                chats.list.push(action.payload);
        },
    },
});

export const { chatsReceived, chatsRequested, chatsRequestFailed, chatAdded } =
    slice.actions;
export default slice.reducer;

export const loadChats = (classCourseId) => (dispatch, getState) => {
    const { lastFetch } = getState().chats;
    const diffInMinutes = moment().diff(moment(lastFetch), 'minutes');
    if (diffInMinutes < 0) return;

    return dispatch(
        apiCallBegan({
            url: `/chatCord/${classCourseId}`,
            onStart: chatsRequested.type,
            onSuccess: chatsReceived.type,
            onError: chatsRequestFailed.type,
        })
    );
};

export const addChat = (newMessage) => ({
    type: chatAdded.type,
    payload: newMessage,
});
