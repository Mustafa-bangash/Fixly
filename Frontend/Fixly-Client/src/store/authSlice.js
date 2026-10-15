import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  pendingEmail: '',
  pendingRole: 'customer',
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
    setPendingAuth(state, action) {
      state.pendingEmail = action.payload.email;
      state.pendingRole = action.payload.role || 'customer';
    },
    setPendingEmail(state, action) {
      state.pendingEmail = action.payload;
    },
    setPendingRole(state, action) {
      state.pendingRole = action.payload || 'customer';
    },
    clearPendingAuth(state) {
      state.pendingEmail = '';
      state.pendingRole = 'customer';
    },
  },
});

export const {
  setUser,
  clearUser,
  setPendingAuth,
  setPendingEmail,
  setPendingRole,
  clearPendingAuth,
} = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectPendingEmail = (state) => state.auth.pendingEmail;
export const selectPendingRole = (state) => state.auth.pendingRole;

export default authSlice.reducer;
