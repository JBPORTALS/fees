"use client";
import { fetchBranchList } from "@/store/fees.slice";
import "../../globals.css";
import { store } from "@/store";

export default function DashboardRootLayout(props: {
  children: React.ReactNode;
  drawers: React.ReactNode;
}) {
  const branchList = store.getState().fees.all_fee.data;

  branchList.length == 0 && store.dispatch(fetchBranchList());

  return (
    <>
      {props.drawers}
      {props?.children}
    </>
  );
}
