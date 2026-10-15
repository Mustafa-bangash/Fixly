import { createSlice } from '@reduxjs/toolkit';

const getStoredUser = () => {
  try {
    const item = localStorage.getItem('fixly_user');
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
};

const storedUser = getStoredUser();

const initialState = {
  user: storedUser,
  isAuthenticated: !!storedUser,
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
      try {
        if (action.payload) {
          localStorage.setItem('fixly_user', JSON.stringify(action.payload));
        } else {
          localStorage.removeItem('fixly_user');
        }
      } catch {
        // ignore storage errors
      }
    },
    clearUser(state) {
      state.user = null;
      state.isAuthenticated = false;
      try {
        localStorage.removeItem('fixly_user');
      } catch {
        // ignore storage errors
      }
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
