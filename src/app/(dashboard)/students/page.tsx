"use client";
import AddStudentsDetails from "@/components/drawers/AddStudentDetails";
import StudentDataGrid from "@/components/layouts/StudentDataGrid";
import { MenuContent, MenuRoot, MenuTrigger } from "@/components/ui/menu";
import { InfoCard } from "@/components/ui/utils/InfoCard";
import { useAppDispatch } from "@/hooks";
import { useAppSelector } from "@/store";
import { fetchFeeDetails, fetchYearList } from "@/store/fees.slice";
import { useUser } from "@/utils/auth";
import { Button, Field, HStack, NativeSelect, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { AiOutlineUserAdd } from "react-icons/ai";
import { LuChevronDown, LuDatabase } from "react-icons/lu";

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
  const acadYear = useAppSelector((state) => state.fees.acadYear);
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

  useEffect(() => {
    setState({
      branch: "",
      status: "ALL",
      year: "",
    });
  }, [acadYear]);

  return (
    <>
      <HStack
        gap={"3"}
        shadow={"xs"}
        position={"sticky"}
        top={"20"}
        p={"2"}
        rounded={"lg"}
        bg={"AppWorkspace/60"}
        backdropFilter={"blur(5px)"}
        borderWidth={"thin"}
        borderColor={"border.muted"}
        justifyContent={"space-between"}
      >
        <HStack gap={"3"}>
          <NativeSelect.Root w={"250px"}>
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
                  value:
                    option[user?.college == "HOSTEL" ? "college" : "branch"],
                }))
                .map((item) => (
                  <option value={item.value}>{item.option}</option>
                ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>

          {state.branch ? (
            <NativeSelect.Root w={"250px"}>
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

        <HStack>
          {state.branch && state.year && (
            <MenuRoot positioning={{ placement: "bottom-end" }}>
              <MenuTrigger asChild>
                <Button size={"sm"} colorPalette={"gray"} variant={"ghost"}>
                  <LuDatabase />
                  Download Class Data <LuChevronDown />
                </Button>
              </MenuTrigger>
              <MenuContent zIndex={"popover"} pos={"sticky"}>
                <VStack px={"4"}>
                  <Field.Root>
                    <NativeSelect.Root>
                      <NativeSelect.Field
                        value={state.branch}
                        onChange={(e) =>
                          setState((prev) => ({
                            ...prev,
                            branch: e.target.value,
                          }))
                        }
                      >
                        <option value={""}>NativeSelect.Root Branch</option>
                        {branch_list.map((option: any) => (
                          <option key={option?.branch} value={option?.branch}>
                            {option?.branch}
                          </option>
                        ))}
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                  </Field.Root>
                  <Field.Root>
                    <NativeSelect.Root>
                      <NativeSelect.Field
                        value={state.year}
                        onChange={(e) =>
                          setState((prev) => ({
                            ...prev,
                            year: e.target.value,
                          }))
                        }
                      >
                        <option value={""}>NativeSelect.Root Year</option>
                        {(user?.college == "KSIT"
                          ? [{ year: 1 }, { year: 2 }, { year: 3 }, { year: 4 }]
                          : yearList
                        ).map((option: any) => (
                          <option value={option?.year} key={option?.year}>
                            {option?.year}
                          </option>
                        ))}
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                  </Field.Root>
                  <Field.Root>
                    <NativeSelect.Root>
                      <NativeSelect.Field
                        onChange={(e) =>
                          setState((prev) => ({
                            ...prev,
                            status: e.target.value,
                          }))
                        }
                        value={state.status}
                      >
                        <option value={""}>NativeSelect.Root Status</option>
                        <option value={"ALL"}>All</option>
                        <option value={"NOT PAID"}>Not Paid</option>
                        <option value={"PARTIALLY PAID"}>Partially Paid</option>
                        <option value={"FULL PAID"}>Full Paid</option>
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                  </Field.Root>
                  <Field.Root w={"full"}>
                    <Button
                      w={"full"}
                      disabled={!state.branch || !state.year}
                      colorPalette="blue"
                      asChild
                    >
                      <Link
                        target={"_blank"}
                        href={`${process.env.NEXT_PUBLIC_ADMIN_URL}downloadclassexcel.php?college=${user?.college}&branch=${state.branch}&year=${state.year}&status=${state.status}&acadYear=${acadYear}`}
                      >
                        Download Excel
                      </Link>
                    </Button>
                  </Field.Root>
                </VStack>
              </MenuContent>
            </MenuRoot>
          )}
          <AddStudentsDetails>
            {({ onOpen }) => (
              <Button
                onClick={onOpen}
                marginLeft={"auto"}
                size={"sm"}
                colorPalette="facebook"
              >
                <AiOutlineUserAdd />
                New Student
              </Button>
            )}
          </AddStudentsDetails>
        </HStack>
      </HStack>

      <VStack gap={0}>
        {!state.branch ? (
          <InfoCard message="Select Branch" />
        ) : state.branch && !state.year ? (
          <InfoCard message="Select Year" />
        ) : (
          <VStack
            px={0}
            gap={0}
            className={"justify-start items-start flex w-full h-full"}
            w={"full"}
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
