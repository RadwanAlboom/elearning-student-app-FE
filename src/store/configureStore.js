import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import reducer from './reducer';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import api from './middleware/api';

const persistConfig = {
    key: 'root',
    storage,
};

export const persistedReducer = persistReducer(persistConfig, reducer);

export default function configureAppStore() {
    return configureStore({
        reducer: persistedReducer,
        middleware: [
            ...getDefaultMiddleware({
                serializableCheck: false,
            }),
            api,
        ],
    });
}
