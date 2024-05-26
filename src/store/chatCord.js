import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./api";
import moment from "moment";

const slice = createSlice({
    name: "chats",
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
                chats.list.unshift(action.payload);
        },
        RESET_DATA: (chats, action) => {
            chats.list = [];
        },
    },
});

export const {
    chatsReceived,
    chatsRequested,
    chatsRequestFailed,
    chatAdded,
    RESET_DATA,
} = slice.actions;
export default slice.reducer;

const resetData = () => ({
    type: RESET_DATA,
});

export const loadChats = (classCourseId) => (dispatch, getState) => {
    const { lastFetch } = getState().chats;
    const diffInMinutes = moment().diff(moment(lastFetch), "minutes");
    if (diffInMinutes < 0) return;
    dispatch(resetData());

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
