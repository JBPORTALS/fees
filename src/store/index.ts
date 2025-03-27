import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { FeesSlice } from "./fees.slice";

export const store = configureStore({
  reducer: {
    [FeesSlice.name]: FeesSlice.reducer,
  },
  devTools: {
    name: "My Fee Store",
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
