"use client";
import { fetchBranchList, fetchYearList } from "@/store/fees.slice";
import "../../globals.css";
import { useAppSelector } from "@/store";
import { useEffect } from "react";
import { useAppDispatch } from "@/hooks";
import { useUser } from "@/utils/auth";

export default function DashboardRootLayout(props: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const user = useUser();
  const acadYear = useAppSelector((state) => state.fees.acadYear);

  useEffect(() => {
    if (user?.college) {
      dispatch(fetchBranchList({ college: user?.college! }));
      dispatch(fetchYearList({ college: user?.college! }));
    }
  }, [dispatch, user?.college, acadYear]);

  return <>{props?.children}</>;
}
