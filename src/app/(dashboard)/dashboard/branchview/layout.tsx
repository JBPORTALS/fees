"use client";

import { useSupabase } from "@/app/supabase-provider";
import "../../../globals.css";
import { useAppDispatch } from "@/hooks";
import { fetchBranchFeeDetails, fetchBranchList } from "@/store/fees.slice";
import { useCallback, useEffect } from "react";

export default async function DashboardRootLayout(props: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const user = useSupabase().user;
  const fetchBranchListMemo = useCallback(() => {
    dispatch(fetchBranchList({ college: user?.college! }));
    dispatch(fetchBranchFeeDetails({ college: user?.college! }));
  }, [dispatch]);

  useEffect(() => {
    fetchBranchListMemo();
  }, []);
  return <>{props?.children}</>;
}
