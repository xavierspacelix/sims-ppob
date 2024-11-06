import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import balanceReducer from "../features/balanceSlice";
import servicesReducer from "../features/serviceSlice";
import bannerReducer from "../features/bannerSlice";
import transactionReducer from "../features/transactionSlice";
import { useDispatch } from "react-redux";

const store = configureStore({
  reducer: {
    auth: authReducer,
    balance: balanceReducer,
    services: servicesReducer,
    banner: bannerReducer,
    transaction: transactionReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
