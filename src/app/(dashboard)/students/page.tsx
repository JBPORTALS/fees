"use client";
import AddStudentsDetails from "@/components/drawers/AddStudentDetails";
import StudentDataGrid from "@/components/layouts/StudentDataGrid";
import ISelect from "@/components/ui/utils/ISelect";
import { InfoCard } from "@/components/ui/utils/InfoCard";
import { useAppDispatch } from "@/hooks";
import { useAppSelector } from "@/store";
import { fetchFeeDetails, fetchYearList } from "@/store/fees.slice";
import { useUser } from "@/utils/auth";
import {
  Button,
  FormControl,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  Select,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { AiOutlineDatabase, AiOutlineUserAdd } from "react-icons/ai";
import { FaChevronDown } from "react-icons/fa";

export default function Students() {
  const [state, setState] = useState({
    branch: "",
    year: "",
    status: "ALL",
  });

  const branch_list = useAppSelector(
    (state) => state.fees.branch_list.data
  ) as [];
  const dispatch = useAppDispatch();
  const yearList = useAppSelector((state) => state.fees.year_list);
  const user = useUser();

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
            <Menu placement="bottom-end">
              <MenuButton
                as={Button}
                leftIcon={<AiOutlineDatabase />}
                size={"sm"}
                variant={"ghost"}
                rightIcon={<FaChevronDown />}
                position={"sticky"}
                zIndex={"dropdown"}
              >
                Download Class Data
              </MenuButton>
              <MenuList zIndex={"popover"} pos={"sticky"}>
                <VStack px={"4"}>
                  <FormControl>
                    <Select
                      value={state.branch}
                      onChange={(e) =>
                        setState((prev) => ({
                          ...prev,
                          branch: e.target.value,
                        }))
                      }
                    >
                      <option value={""}>Select Branch</option>
                      {branch_list.map((option: any) => (
                        <option key={option?.branch} value={option?.branch}>
                          {option?.branch}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <Select
                      value={state.year}
                      onChange={(e) =>
                        setState((prev) => ({
                          ...prev,
                          year: e.target.value,
                        }))
                      }
                    >
                      <option value={""}>Select Year</option>
                      {(user?.college == "KSIT"
                        ? [{ year: 1 }, { year: 2 }, { year: 3 }, { year: 4 }]
                        : yearList
                      ).map((option: any) => (
                        <option value={option?.year} key={option?.year}>
                          {option?.year}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <Select
                      onChange={(e) =>
                        setState((prev) => ({
                          ...prev,
                          status: e.target.value,
                        }))
                      }
                      value={state.status}
                    >
                      <option value={""}>Select Status</option>
                      <option value={"ALL"}>All</option>
                      <option value={"NOT PAID"}>Not Paid</option>
                      <option value={"PARTIALLY PAID"}>Partially Paid</option>
                      <option value={"FULL PAID"}>Full Paid</option>
                    </Select>
                  </FormControl>
                  <FormControl w={"full"}>
                    <Button
                      w={"full"}
                      target={"_blank"}
                      isDisabled={!state.branch || !state.year}
                      colorScheme="blue"
                      as={Link}
                      href={`${process.env.NEXT_PUBLIC_ADMIN_URL}downloadclassexcel.php?college=${user?.college}&branch=${state.branch}&year=${state.year}&status=${state.status}`}
                    >
                      Download Excel
                    </Button>
                  </FormControl>
                </VStack>
              </MenuList>
            </Menu>
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
