"use client";
import { useAppDispatch } from "@/hooks";
import { useAppSelector } from "@/store";
import { fetchFeeDetails } from "@/store/fees.slice";
import { HStack, NativeSelect, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { InfoCard } from "@/components/ui/utils/InfoCard";

import { useUser } from "@/utils/auth";
import { ClassDataTable } from "./data-table";

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
      <HStack
        gap={"3"}
        shadow={"xs"}
        position={"sticky"}
        top={"36"}
        p={"2"}
        rounded={"lg"}
        bg={"AppWorkspace/60"}
        backdropFilter={"blur(5px)"}
        borderWidth={"thin"}
        borderColor={"border.muted"}
      >
        <NativeSelect.Root variant={"subtle"} w={"250px"}>
          <NativeSelect.Field
            value={state.branch}
            onChange={(e) =>
              setState((prev) => ({ ...prev, branch: e.target.value }))
            }
          >
            <option>Select Branch</option>
            {branch_list
              .map((option: any) => ({
                option:
                  option[user?.college == "HOSTEL" ? "college" : "branch"],
                value: option[user?.college == "HOSTEL" ? "college" : "branch"],
              }))
              .map((item) => (
                <option value={item.value}>{item.option}</option>
              ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>

        {state.branch ? (
          <NativeSelect.Root variant={"subtle"} w={"250px"}>
            <NativeSelect.Field
              value={state.year}
              onChange={(e) =>
                setState((prev) => ({ ...prev, year: e.target.value }))
              }
            >
              <option>Select Year</option>
              {yearList
                .map((option: any) => ({
                  value: option.year,
                  option: option.year,
                }))
                .map((item) => (
                  <option value={item.value}>{item.option}</option>
                ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        ) : null}
      </HStack>
      <VStack className="w-full h-full" gap={0}>
        {!state.branch ? (
          <InfoCard message="Select Branch" />
        ) : state.branch && !state.year ? (
          <InfoCard message="Select Year" />
        ) : null}
        {/* displaying admin childrens */}
        {state.branch && state.year && (
          <VStack w={"full"}>
            <ClassDataTable />
          </VStack>
        )}
      </VStack>
    </>
  );
}
