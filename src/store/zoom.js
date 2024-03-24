import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from './api';
import moment from 'moment';

const slice = createSlice({
    name: 'links',
    initialState: {
        list: [],
        loading: false,
        lastFetch: null,
    },
    reducers: {
        linksRequested: (links, action) => {
            links.loading = true;
        },
        linksReceived: (links, action) => {
            links.list = action.payload;
            links.loading = false;
            links.lastFetch = Date.now();
        },

        linksRequestFailed: (links, action) => {
            links.loading = false;
        },

        linkAdded: (links, action) => {
            links.list.push(action.payload);
        },
        linkDeleted: (links, action) => {
            const newLinks = links.list.filter((link) => {
                return link.id + '' !== action.payload.id;
            });
            links.list = newLinks;
        },
        linkUpdated: (links, action) => {
            const { id, newLink } = action.payload;
            const index = links.list.findIndex((link) => link.id + '' === id);
            links.list[index] = newLink;
        },
    },
});

export const {
    linksReceived,
    linksRequested,
    linksRequestFailed,
    linkAdded,
    linkDeleted,
    linkUpdated,
} = slice.actions;
export default slice.reducer;

export const loadLinks = (id) => (dispatch, getState) => {
    const { lastFetch } = getState().entities.zoom;
    const diffInMinutes = moment().diff(moment(lastFetch), 'minutes');
    if (diffInMinutes < 0) return;

    return dispatch(
        apiCallBegan({
            url: `/courses/classCourses/links/${id}`,
            onStart: linksRequested.type,
            onSuccess: linksReceived.type,
            onError: linksRequestFailed.type,
        })
    );
};

export const addLink = (newLink, id) =>
    apiCallBegan({
        url: `/courses/classCourses/links/${id}`,
        method: 'post',
        data: newLink,
        name: 'zoomLink',
        onSuccess: linkAdded.type,
    });

export const deleteLink = (id) =>
    apiCallBegan({
        url: `/courses/classCourses/links/${id}`,
        method: 'delete',
        name: 'zoomLink',
        onSuccess: linkDeleted.type,
    });

export const updateLink = (id, updatedLink) =>
    apiCallBegan({
        url: `/courses/classCourses/links/${id}`,
        method: 'put',
        data: updatedLink,
        name: 'zoomLink',
        onSuccess: linkUpdated.type,
    });
