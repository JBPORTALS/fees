"use client";
import ISelect from "@/components/ui/utils/ISelect";
import { useAppDispatch } from "@/hooks";
import { useAppSelector } from "@/store";
import { fetchFeeDetails } from "@/store/fees.slice";
import { VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ClassDataGrid from "@/components/layouts/ClassDataGrid";
import { InfoCard } from "@/components/ui/utils/InfoCard";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import { useUser } from "@/utils/auth";

export default function BranchViewPage() {
  const [state, setState] = useState({
    branch: "",
    year: "",
  });
  const branch_list = useAppSelector(
    (state) => state.fees.branch_list.data
  ) as [];
  const user = useUser();
  const dispatch = useAppDispatch();
  const yearList = useAppSelector((state) => state.fees.year_list);

  useEffect(() => {
    if (state.branch && state.year && user?.college)
      dispatch(
        fetchFeeDetails({
          branch: state.branch,
          year: state.year,
          college: user?.college!,
        })
      );
  }, [state.branch, state.year, user?.college, dispatch]);

  return (
    <>
      <div className="w-full flex border-b py-3 space-x-3 px-5">
        <ISelect
          placeHolder="Branch"
          value={state.branch}
          onChange={(value) =>
            setState((prev) => ({ ...prev, branch: value as string }))
          }
          options={branch_list.map((option: any) => ({
            option: option[user?.college == "HOSTEL" ? "college" : "branch"],
            value: option[user?.college == "HOSTEL" ? "college" : "branch"],
          }))}
        />

        {state.branch ? (
          <ISelect
            placeHolder="Year"
            value={state.year}
            onChange={(value) =>
              setState((prev) => ({ ...prev, year: value as string }))
            }
            options={yearList.map((option: any) => ({
              value: option.year,
              option: option.year,
            }))}
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
          {state.branch && state.year && (
            <VStack h={"90vh"} w={"full"}>
              <ClassDataGrid />
            </VStack>
          )}
        </VStack>
      </VStack>
    </>
  );
}
