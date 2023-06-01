"use client";

import { useAppDispatch } from "@/hooks";
import "../../../globals.css";
import {useCallback,useEffect} from "react"
import { useSearchParams } from "next/navigation";
import { fetchSearchByMode } from "@/store/fees.slice";

export default function SearchViewLayout(props: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const params = useSearchParams();

  const branch = params.get("branch");
  const sem = params.get("sem");
  const toDate = params.get("toDate");
  const fromDate = params.get("fromDate");
  const mode = params.get("mode");
  const hash = params.get("hash");
  const feeType = params.get("feeType");

  const fetchSearchResult = useCallback(() => {
    if (branch && mode && fromDate && toDate && sem && hash && feeType)
      dispatch(
        fetchSearchByMode({
          feeType,
          branch,
          mode,
          fromDate,
          toDate,
          sem,
        })
      );
  }, [branch, sem, toDate, mode, fromDate, hash, feeType]);

  useEffect(() => {
    fetchSearchResult();
  }, []);
  
  return <>{props?.children}</>;
}
