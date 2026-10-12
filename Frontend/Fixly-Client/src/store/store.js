import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './uiSlice.js';
// main redux store of the app, every slice has to be added inside reducer
export const store = configureStore({
  reducer: {
        // ui slice keeps the online / offline status
    ui: uiReducer,
  },
});
