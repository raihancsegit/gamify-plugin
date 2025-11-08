import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getPointTypes } from '../../services/api';

// Async thunk to fetch point types from the API
export const fetchPointTypes = createAsyncThunk(
    'pointTypes/fetchPointTypes',
    async () => {
        const response = await getPointTypes();
        return response.data;
    }
);

const initialState = {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

const pointTypesSlice = createSlice({
    name: 'pointTypes',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPointTypes.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPointTypes.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchPointTypes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default pointTypesSlice.reducer;