"use client";

import GenerateRecieptLayout from "@/components/layouts/GenerateRecieptLayout";
import { store } from "../../../store/";
import { useCallback, useEffect } from "react";
import { fetchBranchList } from "@/store/fees.slice";
import { useSupabase } from "@/app/supabase-provider";

export default async function GenerateRecieptRootLayout(props: {
  children: React.ReactNode;
}) {
  const user = useSupabase().user;

  const fetchBranchListCb = useCallback(()=>{
      store.dispatch(fetchBranchList({college:user?.college!}))
  },[store.dispatch]);
 
  useEffect(()=>{
    fetchBranchListCb()
  },[])

  return <GenerateRecieptLayout>{props?.children}</GenerateRecieptLayout>;
}
