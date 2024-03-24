import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from './api';

const slice = createSlice({
    name: 'profile',
    initialState: {
        list: {},
        recevier: {},
        teacher: {},
    },
    reducers: {
        profileReceived: (profile, action) => {
            profile.list = action.payload;
        },
        profileImageUpdated: (profile, action) => {
            const { newImg } = action.payload;
            profile.list.image = newImg;
        },

        profileRecevierReceived: (profile, action) => {
            profile.recevier = action.payload;
        },
        profileTeacherReceived: (profile, action) => {
            profile.teacher = action.payload;
        },
    },
});

export const {
    profileReceived,
    profileImageUpdated,
    profileRecevierReceived,
    profileTeacherReceived,
} = slice.actions;
export default slice.reducer;

export const loadProfile = (userId) => (dispatch, getState) => {
    return dispatch(
        apiCallBegan({
            url: `/profile/${userId}`,
            method: 'get',
            onSuccess: profileReceived.type,
        })
    );
};
export const loadRecevierProfile = (userId) => (dispatch, getState) => {
    return dispatch(
        apiCallBegan({
            url: `/profile/recevier/${userId}`,
            method: 'get',
            onSuccess: profileRecevierReceived.type,
        })
    );
};

export const loadTeacherProfile = (userId) => (dispatch, getState) => {
    return dispatch(
        apiCallBegan({
            url: `/profile/teacher/${userId}`,
            method: 'get',
            onSuccess: profileTeacherReceived.type,
        })
    );
};

export const updateImageProfile = (id, newImg) =>
    apiCallBegan({
        url: `/profile/${id}`,
        method: 'put',
        name: 'imageUpdated',
        data: newImg,
        onSuccess: profileImageUpdated.type,
    });

export const updatePassProfile = (id, newPass) =>
    apiCallBegan({
        url: `/profile/password/${id}`,
        method: 'put',
        data: newPass,
    });
