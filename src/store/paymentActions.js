import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./api";

const slice = createSlice({
    name: "paymentActions",
    initialState: {
        list: [],
        loading: false,
        lastFetch: null,
    },
    reducers: {
        paymentActionsRequested: (paymentActions, action) => {
            paymentActions.loading = true;
        },
        paymentActionsReceived: (paymentActions, action) => {
            paymentActions.list = action.payload;
            paymentActions.loading = false;
            paymentActions.lastFetch = Date.now();
        },
        paymentActionsRequestFailed: (paymentActions, action) => {
            paymentActions.loading = false;
        },
        paymentAtionUpdated: (paymentActions, action) => {
            const { chapterId, userId, newPaymentAmount } = action.payload;
            console.log(chapterId, userId, newPaymentAmount);
            const index = paymentActions.list.findIndex(
                (paymentAction) =>
                    paymentAction.chapterId + '' === chapterId &&
                    paymentAction.userId + '' === userId
            );
            const oldPaymentAction = paymentActions.list[index];
            paymentActions.list[index] = {
                ...oldPaymentAction,
                payment: newPaymentAmount,
            };
        },
        RESET_DATA: (paymentActions, action) => {
            paymentActions.list = [];
        },
    },
});

export const {
    paymentActionsReceived,
    paymentActionsRequested,
    paymentActionsRequestFailed,
    paymentAtionUpdated,
    RESET_DATA,
} = slice.actions;
export default slice.reducer;

const resetData = () => ({
    type: RESET_DATA,
});

export const loadPaymentActions = (userId) => (dispatch, getState) => {
    dispatch(resetData());

    return dispatch(
        apiCallBegan({
            url: `/users/${userId}/payment-actions`,
            onStart: paymentActionsRequested.type,
            onSuccess: paymentActionsReceived.type,
            onError: paymentActionsRequestFailed.type,
        })
    );
};

export const updatePaymentAmount = (chapterId, userId, newPaymentAmount) =>
    apiCallBegan({
        url: `/users/${userId}/chapters/${chapterId}/payment-actions`,
        method: "put",
        name: "paymentActions",
        data: { newPaymentAmount },
        onSuccess: paymentAtionUpdated.type,
    });
