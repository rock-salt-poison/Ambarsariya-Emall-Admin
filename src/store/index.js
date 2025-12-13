import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import otpReducer from "./otpSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage

// 1. Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "otp"], // persist only auth slice
};

// 2. Combine reducers (even if just one)
const rootReducer = combineReducers({
  auth: authReducer,
  otp: otpReducer
});

// 3. Wrap with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4. Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }),
});

// 5. Create persistor
export const persistor = persistStore(store);
export default store;