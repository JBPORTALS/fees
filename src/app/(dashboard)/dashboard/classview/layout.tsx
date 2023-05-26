"use client";
import ISelect from "@/components/ui/utils/ISelect";
import { useAppDispatch } from "@/hooks";
import { useAppSelector } from "@/store";
import {
  fetchBranchFeeDetails,
  fetchBranchList,
  fetchFeeDetails,
  fetchOverAllFee,
} from "@/store/fees.slice";
import { VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { InfoCard } from "@/components/ui/utils/InfoCard";

export default async function ClassViewLayout(props: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState({
    branch: "",
    year: "",
  });
  const branch_list = useAppSelector(
    (state) => state.fees.branch_list.data
  ) as [];
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchBranchList());
  }, []);

  useEffect(() => {
    if (state.branch && state.year)
      dispatch(fetchFeeDetails({ branch: state.branch, year: state.year }));

    dispatch(fetchBranchFeeDetails());
    dispatch(fetchOverAllFee());
  }, [state.branch, state.year, dispatch]);

  return (
    <>
      <div className="w-full flex border-b py-2 space-x-3 px-5">
        <ISelect
          placeHolder="Branch"
          value={state.branch}
          onChange={(value) =>
            setState((prev) => ({ ...prev, branch: value as string }))
          }
          options={branch_list.map((option: any) => ({
            option: option.branch,
            value: option.branch,
          }))}
        />

        {state.branch ? (
          <ISelect
            placeHolder="Year"
            value={state.year}
            onChange={(value) =>
              setState((prev) => ({ ...prev, year: value as string }))
            }
            options={[
              { value: "1", option: "1" },
              { value: "2", option: "2" },
            ]}
          />
        ) : null}
      </div>
      <VStack className="w-full h-full" spacing={0}>
        {!state.branch ? (
          <InfoCard message="Select Branch" />
        ) : state.branch && !state.year ? (
          <InfoCard message="Select Year" />
        ) : null}
        <VStack
          px={0}
          spacing={0}
          className={
            "justify-start items-start flex w-full h-full overflow-scroll"
          }
        >
          {/* displaying admin childrens */}
          {state.branch && state.year && props.children}
        </VStack>
      </VStack>
    </>
  );
}
