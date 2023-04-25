import {  configureStore } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { AdmissionsSlice } from './admissions.slice';
import { FeesSlice } from "./fees.slice";



export const store = configureStore({
  reducer: {
    [AdmissionsSlice.name]:AdmissionsSlice.reducer,
    [FeesSlice.name]:FeesSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppSelector = useSelector<RootState>