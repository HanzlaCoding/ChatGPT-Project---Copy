import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chat: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    loadTitle: (state, action) => {
      state.chat = action.payload;
    },
    addTitle: (state, action) => {
      state.chat.push(action.payload);
    },
  },
});

export const { addTitle, loadTitle } = chatSlice.actions;
export default chatSlice.reducer;
