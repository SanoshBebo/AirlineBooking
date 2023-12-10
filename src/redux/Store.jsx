// src/redux/store.js

import { configureStore } from "@reduxjs/toolkit";
import UserReducer, { loadUserFromStorage } from "./userSlice";

const store = configureStore({
  reducer: {
    user: UserReducer,
  },
});

store.dispatch(loadUserFromStorage());

export { store };
