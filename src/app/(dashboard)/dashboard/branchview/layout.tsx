"use client";

import "../../../globals.css";
import { useAppDispatch } from "@/hooks";
import { fetchBranchFeeDetails, fetchBranchList } from "@/store/fees.slice";
import { useCallback, useEffect } from "react";

export default async function DashboardRootLayout(props: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const fetchBranchListMemo = useCallback(()=>{
    dispatch(fetchBranchList());
    dispatch(fetchBranchFeeDetails());
  },[dispatch])

  useEffect(() => {
    fetchBranchListMemo()
  }, []);
  return <>{props?.children}</>;
}

