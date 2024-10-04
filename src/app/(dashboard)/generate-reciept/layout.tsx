"use client";

import GenerateRecieptLayout from "@/components/layouts/GenerateRecieptLayout";
import { store } from "../../../store/";
import { useCallback, useEffect } from "react";
import { fetchBranchList } from "@/store/fees.slice";
import { useUser } from "@/utils/auth";

export default function GenerateRecieptRootLayout(props: {
  children: React.ReactNode;
}) {
  const user = useUser();

  const fetchBranchListCb = useCallback(() => {
    store.dispatch(fetchBranchList({ college: user?.college! }));
  }, [user?.college]);

  useEffect(() => {
    fetchBranchListCb();
  }, [fetchBranchListCb]);

  return <GenerateRecieptLayout>{props?.children}</GenerateRecieptLayout>;
}
