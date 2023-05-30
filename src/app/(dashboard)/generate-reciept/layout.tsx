"use client";

import GenerateRecieptLayout from "@/components/layouts/GenerateRecieptLayout";
import { store } from "../../../store/";
import { useCallback, useEffect } from "react";
import { fetchBranchList } from "@/store/fees.slice";

export default async function GenerateRecieptRootLayout(props: {
  children: React.ReactNode;
}) {

  const fetchBranchListCb = useCallback(()=>{
      store.dispatch(fetchBranchList())
  },[store.dispatch]);
 
  useEffect(()=>{
    fetchBranchListCb()
  },[])

  return <GenerateRecieptLayout>{props?.children}</GenerateRecieptLayout>;
}
