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
            const { newImg, newImgId } = action.payload;
            profile.list.image = newImg;
            profile.list.imageId = newImgId;
        },
        contactMethodUpdated: (profile, action) => {
            const { newWhatsLink, newFacebookLink, newPhone } = action.payload;
            profile.list.whatsapp = newWhatsLink;
            profile.list.facebook = newFacebookLink;
            profile.list.phone = newPhone;
        },
        profileRecevierReceived: (profile, action) => {
            profile.recevier = action.payload;
        },
        profileTeacherReceived: (profile, action) => {
            profile.teacher = action.payload;
        },
        RESET_DATA: (profile, action) => {
            profile.list = {};
            profile.recevier = {};
            profile.teacher = {};
        },
    },
});

export const {
    profileReceived,
    profileImageUpdated,
    profileRecevierReceived,
    profileTeacherReceived,
    contactMethodUpdated,
    RESET_DATA,
} = slice.actions;
export default slice.reducer;

const resetData = () => ({
    type: RESET_DATA,
});

export const loadProfile = (userId) => (dispatch, getState) => {
    dispatch(resetData());
    return dispatch(
        apiCallBegan({
            url: `/profile/${userId}`,
            method: 'get',
            onSuccess: profileReceived.type,
        })
    );
};
export const loadRecevierProfile = (userId) => (dispatch, getState) => {
    dispatch(resetData());
    return dispatch(
        apiCallBegan({
            url: `/profile/recevier/${userId}`,
            method: 'get',
            onSuccess: profileRecevierReceived.type,
        })
    );
};

export const loadTeacherProfile = (userId) => (dispatch, getState) => {
    dispatch(resetData());
    return dispatch(
        apiCallBegan({
            url: `/profile/teacher/${userId}`,
            method: 'get',
            onSuccess: profileTeacherReceived.type,
        })
    );
};

export const updateImageProfile = (id, newImage) =>
    apiCallBegan({
        url: `/profile/${id}`,
        method: 'put',
        name: 'imageUpdated',
        data: newImage,
        onSuccess: profileImageUpdated.type,
    });

export const updatePassProfile = (id, newPass) =>
    apiCallBegan({
        url: `/profile/password/${id}`,
        method: 'put',
        data: newPass,
    });

export const updateContactMethod = (updatedContactMethod) =>
    apiCallBegan({
        url: `/profile/teacher/contact-method`,
        method: 'put',
        name: 'contactMethodUpdated',
        data: updatedContactMethod,
        onSuccess: contactMethodUpdated.type,
    });
