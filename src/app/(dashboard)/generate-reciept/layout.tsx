"use client";

import GenerateRecieptLayout from "@/components/layouts/GenerateRecieptLayout";
import { store, useAppSelector } from "../../../store/";
import { useCallback, useEffect } from "react";
import { fetchBranchList } from "@/store/fees.slice";

export default function GenerateRecieptRootLayout(props: {
  children: React.ReactNode;
}) {
  const user = useAppSelector((state) => state.fees.user);

  const fetchBranchListCb = useCallback(() => {
    store.dispatch(fetchBranchList({ college: user?.college! }));
  }, [store.dispatch, user?.college]);

  useEffect(() => {
    fetchBranchListCb();
  }, []);

  return <GenerateRecieptLayout>{props?.children}</GenerateRecieptLayout>;
}
