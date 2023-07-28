"use client";
import { fetchBranchList } from "@/store/fees.slice";
import "../../globals.css";
import { store } from "@/store";
import { useSupabase } from "@/app/supabase-provider";

export default function DashboardRootLayout(props: {
  children: React.ReactNode;
}) {
  const branchList = store.getState().fees.all_fee.data;
  const user = useSupabase().user

  branchList.length == 0 && store.dispatch(fetchBranchList({college:user?.college!}));

  return (
    <>
      {props?.children}
    </>
  );
}
