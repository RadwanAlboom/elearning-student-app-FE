import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from './api';

const slice = createSlice({
    name: 'msgNotifications',
    initialState: {
        list: [],
    },
    reducers: {
        notificationsReceived: (msgNotifications, action) => {
            msgNotifications.list = action.payload;
        },

        personAdded: (msgNotifications, action) => {
            let flag = !msgNotifications.list.some(
                (msgNotify) => msgNotify.email === action.payload.email
            );

            if (flag) {
                msgNotifications.list.unshift(action.payload);
            } else {
                if (action.payload.me && action.payload.me === true) {
                    return;
                }
                const index = msgNotifications.list.findIndex(
                    (msgNotify) => msgNotify.email === action.payload.email
                );
                msgNotifications.list[index].counter = 1;
            }
        },
        notificationOpened: (msgNotifications, action) => {
            const index = msgNotifications.list.findIndex(
                (msgNotify) => msgNotify.chatId + '' === action.payload.id + ''
            );
            if (msgNotifications.list[index]) {
                msgNotifications.list[index].counter = 0;
            }
        },
    },
});

export const { notificationsReceived, personAdded, notificationOpened } =
    slice.actions;
export default slice.reducer;

export const loadMsgNotifications = (userId) => (dispatch, getState) => {
    return dispatch(
        apiCallBegan({
            url: `/messages/msgNotfications/${userId}`,
            method: 'post',
            onSuccess: notificationsReceived.type,
        })
    );
};

export const addPersonOnChat = (newPerson) => ({
    type: personAdded.type,
    payload: newPerson,
});
export const openNotification = (id) => ({
    type: notificationOpened.type,
    payload: { id },
});
