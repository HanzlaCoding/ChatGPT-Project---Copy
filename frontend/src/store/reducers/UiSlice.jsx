import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ui: [],
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {},
});

export default uiSlice.reducer;
export const uiActions = uiSlice.actions;