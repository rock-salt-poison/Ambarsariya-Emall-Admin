import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  emailOtp: null,
};

const otpSlice = createSlice({
  name: "otp",
  initialState,
  reducers: {
    setEmailOtp: (state, action) => {
      state.emailOtp = action.payload;
    },
    
    clearOtp: (state) => {
      state.emailOtp = null;
    }
  }
});

export const { setEmailOtp, clearOtp } = otpSlice.actions;
export default otpSlice.reducer;
