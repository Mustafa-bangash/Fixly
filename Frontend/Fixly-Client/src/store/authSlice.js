import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  pendingEmail: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    clearUser(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
    setPendingEmail(state, action) {
      state.pendingEmail = action.payload;
    },
    clearPendingEmail(state) {
      state.pendingEmail = '';
    },
  },
});

export const { setUser, clearUser, setPendingEmail, clearPendingEmail } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectPendingEmail = (state) => state.auth.pendingEmail;

export default authSlice.reducer;
