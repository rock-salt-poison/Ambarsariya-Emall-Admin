import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  adminAccessToken: localStorage.getItem('token') || null,
  isAdminAccessTokenValid: false,
};

// Create auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action to set the user access token
    setAdminToken: (state, action) => {
      state.adminAccessToken = action.payload;
    },

    // Action to set the validity of user token
    setAdminTokenValid: (state, action) => {
      state.isAdminAccessTokenValid = action.payload;
    },

    // Action to clear all tokens (e.g., on logout)
    clearTokens: (state) => {
      state.adminAccessToken = null;
      state.isAdminAccessTokenValid = false;
    },
  },
});

// Export actions
export const { 
  setAdminToken, 
  setAdminTokenValid,  
  clearTokens 
} = authSlice.actions;

// Export reducer
export default authSlice.reducer;
