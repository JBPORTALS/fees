"use client";

import { useSupabase } from "@/app/supabase-provider";
import FeesLayout from "@/components/layouts/FeesLayout";
import { useAppDispatch } from "@/hooks";
import { fetchBranchFeeDetails, fetchOverAllFee } from "@/store/fees.slice";
import { useEffect } from "react";

export default async function DashboardRootLayout(props: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const user = useSupabase().user;

  useEffect(() => {
    console.log("college", user);
    if (user?.college) {
      dispatch(fetchBranchFeeDetails({ college: user?.college! }));
      dispatch(fetchOverAllFee({ college: user?.college! }));
    }
  }, [dispatch, user?.college]);

  return <FeesLayout>{props?.children}</FeesLayout>;
}
