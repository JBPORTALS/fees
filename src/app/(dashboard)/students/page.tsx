"use client";
import AddStudentsDetails from "@/components/drawers/AddStudentDetails";
import StudentDataGrid from "@/components/layouts/StudentDataGrid";
import ISelect from "@/components/ui/utils/ISelect";
import { InfoCard } from "@/components/ui/utils/InfoCard";
import { useAppDispatch } from "@/hooks";
import { useAppSelector } from "@/store";
import { fetchFeeDetails, fetchYearList } from "@/store/fees.slice";
import { Button, HStack, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { AiOutlineFileExcel, AiOutlineUserAdd } from "react-icons/ai";

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
  const user = useAppSelector((state) => state.fees.user);

  useEffect(() => {
    if (state.branch && state.year)
      dispatch(
        fetchFeeDetails({
          branch: state.branch,
          year: state.year,
          college: user?.college!,
        })
      );
  }, [state.branch, state.year, dispatch, user?.college]);

  useEffect(() => {
    if (user?.college == "HOSTEL" && state.branch)
      dispatch(fetchYearList({ college: state.branch }));
  }, [state.branch, user?.college]);

  return (
    <>
      <div className="w-full flex justify-between border-b py-3 space-x-3 px-5">
        <div className="flex space-x-3 px-5">
          <ISelect
            placeHolder={user?.college == "HOSTEL" ? "College" : "Branch"}
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
        <HStack>
          {state.branch && state.year && (
            <Button
              size={"sm"}
              download
              leftIcon={<AiOutlineFileExcel />}
              target={"_blank"}
              variant={"ghost"}
              as={Link}
              href={`${process.env.NEXT_PUBLIC_ADMIN_URL}downloadclassexcel.php?college=${user?.college}&branch=${state.branch}&year=${state.year}`}
            >
              Download Excel
            </Button>
          )}
          <AddStudentsDetails>
            {({ onOpen }) => (
              <Button
                leftIcon={<AiOutlineUserAdd />}
                onClick={onOpen}
                marginLeft={"auto"}
                size={"sm"}
                colorScheme="facebook"
              >
                New Student
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
