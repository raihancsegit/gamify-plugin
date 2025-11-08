import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    logs: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

export const logSlice = createSlice({
    name: 'logs',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {

    },
});

export default logSlice.reducer;