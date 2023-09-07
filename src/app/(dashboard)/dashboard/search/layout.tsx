"use client";

import { useAppDispatch } from "@/hooks";
import "../../../globals.css";
import { useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { fetchSearchByMode, fetchSearchRecord } from "@/store/fees.slice";
import { useAppSelector } from "@/store";

export default function SearchViewLayout(props: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const params = useSearchParams();
  const user = useAppSelector(state => state.fees.user)

  const branch = params.get("branch");
  const year = params.get("year");
  const toDate = params.get("toDate");
  const fromDate = params.get("fromDate");
  const mode = params.get("mode");
  const hash = params.get("hash");
  const feeType = params.get("feeType");
  const query = params.get("query");

  const fetchSearchResult = useCallback(() => {
    if (
      branch &&
      mode !== "QUERY" &&
      mode &&
      fromDate &&
      toDate &&
      year &&
      hash &&
      feeType
    )
      dispatch(
        fetchSearchByMode({
          feeType,
          branch,
          mode,
          fromDate,
          toDate,
          year,
          college: user?.college!,
        })
      );
    else if (query)
      dispatch(fetchSearchRecord({ query, college: user?.college! }));
  }, [branch, year, toDate, mode, fromDate, hash, feeType, dispatch, query,user?.college]);

  useEffect(() => {
    fetchSearchResult();
  }, [fetchSearchResult]);

  return <>{props?.children}</>;
}
