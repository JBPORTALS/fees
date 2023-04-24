import {  configureStore } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { AdmissionsSlice } from './admissions.slice';



export const store = configureStore({
  reducer: {
    [AdmissionsSlice.name]:AdmissionsSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppSelector = useSelector<RootState>