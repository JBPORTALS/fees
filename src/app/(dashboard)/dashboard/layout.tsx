"use client";

import FeesLayout from "@/components/layouts/FeesLayout";
import { useAppDispatch } from "@/hooks";
import { fetchBranchFeeDetails, fetchOverAllFee } from "@/store/fees.slice";
import { useCallback, useEffect } from "react";

export default async function DashboardRootLayout(props: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const fetchData = useCallback(() => {
    dispatch(fetchBranchFeeDetails());
    dispatch(fetchOverAllFee());
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, []);
  
  return <FeesLayout>{props?.children}</FeesLayout>;
}
