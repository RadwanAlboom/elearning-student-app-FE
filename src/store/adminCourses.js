import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./api";
import moment from "moment";
import { createSelector } from "reselect";
import auth from "../services/authService";

const slice = createSlice({
    name: "adminCourses",
    initialState: {
        list: [],
        loading: false,
        lastFetch: null,
    },
    reducers: {
        adminCoursesRequested: (adminCourses, action) => {
            adminCourses.loading = true;
        },
        adminCoursesReceived: (adminCourses, action) => {
            const currentUser = auth.getCurrentUser();
            if (currentUser && currentUser.isModerator) {
                const courses = action.payload.filter((course) => {
                    return currentUser.majorId + "" === course.id + "";
                });
                adminCourses.list = courses;
            } else {
                adminCourses.list = action.payload;
            }
            adminCourses.loading = false;
            adminCourses.lastFetch = Date.now();
        },
        adminCoursesRequestFailed: (adminCourses, action) => {
            adminCourses.loading = false;
        },

        // command - event
        // addAdminCourse - adminCourseAdded
        adminCourseAdded: (adminCourses, action) => {
            adminCourses.list.push(action.payload);
        },
        adminCourseDeleted: (adminCourses, action) => {
            const newCourses = adminCourses.list.filter((course) => {
                return course.id + "" !== action.payload.id;
            });
            adminCourses.list = newCourses;
        },
        adminCourseUpdated: (adminCourses, action) => {
            const { id, newCourse } = action.payload;
            const index = adminCourses.list.findIndex(
                (course) => course.id + "" === id
            );
            adminCourses.list[index] = newCourse;
        },
        RESET_DATA: (adminCourses, action) => {
            adminCourses.list = [];
        },
    },
});

export const {
    adminCoursesReceived,
    adminCoursesRequested,
    adminCoursesRequestFailed,
    adminCourseAdded,
    adminCourseDeleted,
    adminCourseUpdated,
    RESET_DATA,
} = slice.actions;
export default slice.reducer;

const url = "/courses";

const resetData = () => ({
    type: RESET_DATA,
});

export const loadAdminCourses = () => (dispatch, getState) => {
    const { lastFetch } = getState().entities.adminCourses;
    const diffInMinutes = moment().diff(moment(lastFetch), "minutes");
    if (diffInMinutes < 0) return;
    dispatch(resetData());

    return dispatch(
        apiCallBegan({
            url,
            onStart: adminCoursesRequested.type,
            onSuccess: adminCoursesReceived.type,
            onError: adminCoursesRequestFailed.type,
        })
    );
};

export const addAdminCourse = (adminCourse) =>
    apiCallBegan({
        url,
        method: "post",
        name: "courses",
        data: adminCourse,
        onSuccess: adminCourseAdded.type,
    });

export const deleteAdminCourse = (id) =>
    apiCallBegan({
        url: `${url}/${id}`,
        method: "delete",
        name: "courses",
        onSuccess: adminCourseDeleted.type,
    });

export const updateAdminCourse = (id, updateCourse) =>
    apiCallBegan({
        url: `${url}/${id}`,
        method: "put",
        name: "courses",
        data: updateCourse,
        onSuccess: adminCourseUpdated.type,
    });

export const getMajor = (id) =>
    createSelector(
        (state) => state.entities.adminCourses,
        (adminCourses) =>
            adminCourses.list.filter((course) => course.id + "" === id + "")
    );

export const getCourses = createSelector(
    (state) => state.entities.adminCourses,
    (adminCourses) => adminCourses.list
);
