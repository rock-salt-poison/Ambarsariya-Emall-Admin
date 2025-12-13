// store/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,      // stores access_token only
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAdminToken: (state, action) => {
      state.token = action.payload; // just store the token
    },
    logout: (state) => {
      state.token = null; // clear token on logout
    },
  },
});

export const { setAdminToken, logout } = authSlice.actions;
export default authSlice.reducer;
