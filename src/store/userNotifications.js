import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { apiCallBegan } from './api';

import auth from '../services/authService';

const slice = createSlice({
    //user => admin, moderator, simple user
    name: 'userNotifications',
    initialState: {
        list: [],
    },
    reducers: {
        notificationsReceived: (userNotifications, action) => {
            userNotifications.list = action.payload;
        },

        // command - event
        // addNotification - notificationAdded
        notificationsAdded: (userNotifications, action) => {
            userNotifications.list.unshift(action.payload);
        },

        notificationOpend: (userNotifications, action) => {
            const index = userNotifications.list.findIndex(
                (notify) => notify.id + '' === action.payload.id
            );
            userNotifications.list[index].open = 1;
        },
    },
});

export const { notificationsReceived, notificationsAdded, notificationOpend } =
    slice.actions;
export default slice.reducer;

// Action Creators
const url =
    auth.getCurrentUser() &&
    `/userRequest/${auth.getCurrentUser().id}/notifications`;

export const loadNotifications = () =>
    apiCallBegan({
        url,
        onSuccess: notificationsReceived.type,
    });

export const addNotification = (payload) => ({
    type: notificationsAdded.type,
    payload,
});

export const getNotOpenedNotification = createSelector(
    (state) => state.userNotifications,
    (userNotifications) => {
        if (userNotifications) {
            return userNotifications.list.filter((notify) => !notify.open);
        }
    }
);

export const openNotification = (id) =>
    apiCallBegan({
        url: `/userRequest/notifications/${id}`,
        method: 'patch',
        name: 'openNotification',
        data: { open: 1 },
        onSuccess: notificationOpend.type,
    });
