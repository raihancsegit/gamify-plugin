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
    view: 'table', // Can be 'table' or 'settings'
    selectedPointType: null, // Holds the ID of the point type being edited, or null for a new one
};

const pointTypesSlice = createSlice({
    name: 'pointTypes',
    initialState,
    // --- New reducers to control the UI view ---
    reducers: {
        setView: (state, action) => {
            state.view = action.payload;
        },
        setSelectedPointType: (state, action) => {
            state.selectedPointType = action.payload;
        },
    },
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

// --- Export the new actions ---
export const { setView, setSelectedPointType } = pointTypesSlice.actions;

export default pointTypesSlice.reducer;