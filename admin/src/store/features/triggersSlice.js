import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Helper function to get the WordPress REST API nonce
const getNonce = () => window.gamifyApiSettings?.nonce || '';

/**
 * Async Thunk for fetching all available and active triggers from the backend.
 */
export const fetchTriggers = createAsyncThunk(
    'triggers/fetchTriggers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/wp-json/gamify/v1/triggers', {
                headers: { 'X-WP-Nonce': getNonce() }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

/**
 * Async Thunk for saving the active triggers configuration to the backend.
 */
export const saveTriggers = createAsyncThunk(
    'triggers/saveTriggers',
    async (activeHooksData, { rejectWithValue }) => {
        try {
            const response = await axios.post('/wp-json/gamify/v1/triggers', activeHooksData, {
                headers: { 'X-WP-Nonce': getNonce() }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const initialState = {
    available: [],
    active: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed' | 'saving'
    error: null,
};

const triggersSlice = createSlice({
    name: 'triggers',
    initialState,
    reducers: {
        // This reducer handles the state changes from drag & drop actions.
        updateTriggerLists: (state, action) => {
            state.available = action.payload.available;
            state.active = action.payload.active;
        },
        // This reducer updates the point value for an active hook.
        updateHookPoints: (state, action) => {
            const { id, points } = action.payload;
            const hookIndex = state.active.findIndex(h => h.id === id);
            if (hookIndex !== -1) {
                state.active[hookIndex].points = points;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // Handle fetching triggers
            .addCase(fetchTriggers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTriggers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const allTriggers = Object.entries(action.payload.available).map(([id, data]) => ({ id, ...data }));
                const activeTriggerMap = action.payload.active;

                // Populate active and available lists based on the API response
                state.active = allTriggers
                    .filter(trigger => activeTriggerMap.hasOwnProperty(trigger.id))
                    .map(trigger => ({ ...trigger, points: activeTriggerMap[trigger.id] }));

                state.available = allTriggers
                    .filter(trigger => !activeTriggerMap.hasOwnProperty(trigger.id));
            })
            .addCase(fetchTriggers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message || 'Failed to fetch triggers.';
            })
            // Handle saving triggers
            .addCase(saveTriggers.pending, (state) => {
                state.status = 'saving';
            })
            .addCase(saveTriggers.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(saveTriggers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message || 'Failed to save settings.';
            });
    },
});

export const { updateTriggerLists, updateHookPoints } = triggersSlice.actions;
export default triggersSlice.reducer;