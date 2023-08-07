"use client";
import { useSupabase } from "@/app/supabase-provider";
import AddStudentsDetails from "@/components/drawers/AddStudentDetails";
import StudentDataGrid from "@/components/layouts/StudentDataGrid";
import ISelect from "@/components/ui/utils/ISelect";
import { InfoCard } from "@/components/ui/utils/InfoCard";
import { useAppDispatch } from "@/hooks";
import { useAppSelector } from "@/store";
import { fetchFeeDetails } from "@/store/fees.slice";
import { Button, HStack, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Students() {
  const [state, setState] = useState({
    branch: "",
    year: "",
  });

  const branch_list = useAppSelector(
    (state) => state.fees.branch_list.data
  ) as [];
  const dispatch = useAppDispatch();
  const yearList = useAppSelector((state) => state.fees.year_list);
  const user = useSupabase().user;

  useEffect(() => {
    if (state.branch && state.year)
      dispatch(
        fetchFeeDetails({
          branch: state.branch,
          year: state.year,
          college: user?.college!,
        })
      );
  }, [state.branch, state.year, dispatch]);

  return (
    <>
      <div className="w-full flex justify-between border-b py-3 space-x-3 px-5">
        <div className="flex space-x-3 px-5">
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
              options={yearList.map((option: any) => ({
                value: option.year,
                option: option.year,
              }))}
            />
          ) : null}
        </div>
        <HStack>
          {state.branch && state.year && (
            <Button
              size={"sm"}
              colorScheme={"whatsapp"}
              target={"_blank"}
              as={Link}
              href={`${process.env.NEXT_PUBLIC_ADMIN_URL}downloadclassexcel.php?college=${user?.college}&branch=${state.branch}&year=${state.year}`}
            >
              Download Excel
            </Button>
          )}
          <AddStudentsDetails>
            {({ onOpen }) => (
              <Button
                onClick={onOpen}
                marginLeft={"auto"}
                size={"sm"}
                colorScheme="purple"
              >
                Add Student
              </Button>
            )}
          </AddStudentsDetails>
        </HStack>
      </div>
      <VStack className="w-full h-[82vh]" spacing={0}>
        {!state.branch ? (
          <InfoCard message="Select Branch" />
        ) : state.branch && !state.year ? (
          <InfoCard message="Select Year" />
        ) : (
          <VStack
            px={0}
            spacing={0}
            className={"justify-start items-start flex w-full h-full"}
          >
            {/* displaying admin childrens */}
            {state.branch && state.year && (
              <VStack h={"full"} w={"full"}>
                <StudentDataGrid />
              </VStack>
            )}
          </VStack>
        )}
      </VStack>
    </>
  );
}
