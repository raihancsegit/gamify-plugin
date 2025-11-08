import { configureStore } from '@reduxjs/toolkit';
import logReducer from './features/logSlice';
import pointTypesReducer from './features/pointTypesSlice';
export const store = configureStore({
    reducer: {
        logs: logReducer,
        pointTypes: pointTypesReducer,
    },
});