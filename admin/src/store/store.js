import { configureStore } from '@reduxjs/toolkit';
import logReducer from './features/logSlice';
import pointTypesReducer from './features/pointTypesSlice';
import triggersReducer from './features/triggersSlice';

export const store = configureStore({
    reducer: {
        logs: logReducer,
        pointTypes: pointTypesReducer,
        triggers: triggersReducer,
    },
});