import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import otpReducer from "./otpSlice";


const store = configureStore({
  reducer: {
    auth: authReducer,
    otp: otpReducer
  },
});

export default store;
