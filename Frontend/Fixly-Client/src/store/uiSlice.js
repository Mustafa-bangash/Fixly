import { createSlice } from '@reduxjs/toolkit';
// slice for small ui things, right now it only tracks if the user is online
// starts with whatever the browser says when the page loads
// changes the status, true or false comes in action.payload
// action that the components dispatch to change the status
// selector so components can read isOnline without knowing the state shape
const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    isOnline: navigator.onLine,
  },
  reducers: {
    setOnline(state, action) {
      state.isOnline = action.payload;
    },
  },
});

export const { setOnline } = uiSlice.actions;
export const selectIsOnline = (state) => state.ui.isOnline;
export default uiSlice.reducer;
