"use client";
import FeesLayout from "@/components/layouts/FeesLayout";
import { useAppDispatch } from "@/hooks";
import { useAppSelector } from "@/store";
import {
  fetchBranchFeeDetails,
  fetchBranchList,
  fetchOverAllFee,
  fetchYearList,
} from "@/store/fees.slice";
import { useEffect } from "react";

export default function DashboardRootLayout(props: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.fees.user);
  const acadYear = useAppSelector((state) => state.fees.acadYear);

  useEffect(() => {
    if (user?.college) {
      dispatch(fetchBranchFeeDetails({ college: user?.college! }));
      dispatch(fetchOverAllFee({ college: user?.college! }));
      dispatch(fetchBranchList({ college: user?.college! }));
      dispatch(fetchYearList({ college: user?.college! }));
    }
  }, [dispatch, user?.college, acadYear]);

  return <FeesLayout>{props?.children}</FeesLayout>;
}
