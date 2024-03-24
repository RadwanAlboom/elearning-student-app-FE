import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from './api';
import moment from 'moment';
import auth from '../services/authService';

const slice = createSlice({
    name: 'units',
    initialState: {
        list: [],
        specificList: [],
        loading: false,
        lastFetch: null,
    },
    reducers: {
        unitsRequested: (units, action) => {
            units.loading = true;
        },
        unitsReceived: (units, action) => {
            units.list = action.payload;
            units.loading = false;
            units.lastFetch = Date.now();
        },

        specificUnitsReceived: (units, action) => {
            units.specificList = action.payload;
            units.loading = false;
            units.lastFetch = Date.now();
        },
        unitsRequestFailed: (units, action) => {
            units.loading = false;
        },

        unitAdded: (units, action) => {
            units.list.push(action.payload);
        },
        unitDeleted: (units, action) => {
            const newUnits = units.list.filter((unit) => {
                return unit.id + '' !== action.payload.id;
            });
            units.list = newUnits;
        },
        unitUpdated: (units, action) => {
            const { id, newUnit } = action.payload;
            const index = units.list.findIndex((unit) => unit.id + '' === id);
            units.list[index] = newUnit;
        },
    },
});

export const {
    unitsReceived,
    specificUnitsReceived,
    unitsRequested,
    unitsRequestFailed,
    unitAdded,
    unitDeleted,
    unitUpdated,
} = slice.actions;
export default slice.reducer;

export const loadUnits = () => (dispatch, getState) => {
    const { lastFetch } = getState().entities.units;
    const diffInMinutes = moment().diff(moment(lastFetch), 'minutes');
    if (diffInMinutes < 0) return;

    return dispatch(
        apiCallBegan({
            url: '/courses/units',
            onStart: unitsRequested.type,
            onSuccess: unitsReceived.type,
            onError: unitsRequestFailed.type,
        })
    );
};

export const addUnit = (newUnit, classCourseId) =>
    apiCallBegan({
        url: `/courses/units/${classCourseId}`,
        method: 'post',
        name: 'chapters',
        data: newUnit,
        onSuccess: unitAdded.type,
    });

export const deleteUnit = (id) =>
    apiCallBegan({
        url: `/courses/units/${id}`,
        method: 'delete',
        name: 'chapters',
        onSuccess: unitDeleted.type,
    });

export const updateUnit = (id, updatedUnit) =>
    apiCallBegan({
        url: `/courses/units/${id}`,
        method: 'put',
        name: 'chapters',
        data: updatedUnit,
        onSuccess: unitUpdated.type,
    });

export const loadSpecificUnits = (classcourse_id, user_id) =>
    apiCallBegan({
        url:
            auth.getCurrentUser() &&
            !auth.getCurrentUser().isModerator &&
            !auth.getCurrentUser().isAdmin
                ? `/courses/units/${classcourse_id}/users/${user_id}`
                : '/courses/units',
        onStart: unitsRequested.type,
        onSuccess: specificUnitsReceived.type,
        onError: unitsRequestFailed.type,
    });
