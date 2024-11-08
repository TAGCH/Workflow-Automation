import { createSlice } from "@reduxjs/toolkit";

const fileSlice = createSlice({
    name: 'files',
    initialState: {
        uploadFile: null,  // Changed to a single file object
    },
    reducers: {
        addFile(state, action) {
            state.uploadFile = action.payload;  // Store only the latest file
        },
        clearFile(state) {
            state.uploadFile = null;
        },
    },
});

export const { addFile, clearFile } = fileSlice.actions;
export default fileSlice.reducer;
