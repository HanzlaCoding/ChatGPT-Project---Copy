import { configureStore } from "@reduxjs/toolkit";
import chatSlice from "./reducers/ChatSlice.jsx";
import uiSlice from "./reducers/UiSlice.jsx";

const store = configureStore({
  reducer: {
    chat: chatSlice,
    ui: uiSlice,
  },
});

export default store;
