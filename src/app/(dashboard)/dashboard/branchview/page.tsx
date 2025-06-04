"use client";
import { useAppDispatch } from "@/hooks";
import { useAppSelector } from "@/store";
import { BranchFee } from "@/store/fees.slice";
import {
  Box,
  Card,
  HStack,
  Heading,
  NativeSelect,
  Stat,
  Tag,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { Bar } from "react-chartjs-2";
import { AiOutlineAim } from "react-icons/ai";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { trpc } from "@/utils/trpc-cleint";
import { useUser } from "@/utils/auth";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function BranchViewPage() {
  const [branch, setBranch] = useState<string>("All");
  const branch_list = useAppSelector(
    (state) => state.fees.branch_list.data
  ) as [];
  const dispatch = useAppDispatch();
  const branchFeeDetails = useAppSelector(
    (state) => state.fees.branch_fee.data
  ) as BranchFee[];
  const acadYear = useAppSelector((state) => state.fees.acadYear) as string;
  const user = useUser();
  const { data: yearFeeDetails } = trpc.feeYearView.useQuery(
    {
      acadYear,
      branch,
      college: user?.college ?? "",
    },
    {
      enabled: !!acadYear && !!branch && !!user?.college,
    }
  );

  return (
    <div className={"h-fit w-full"}>
      <div className="w-full backdrop-blur-sm z-20 h-fit flex border-b py-3 sticky top-0 space-x-3 px-5">
        <NativeSelect.Root>
          <NativeSelect.Field
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
          >
            <option value={""}>All</option>
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
        </NativeSelect.Root>
      </div>
      <VStack p={"5"} h={"fit"}>
        {branch == "All" || !branch ? (
          <HStack>
            <Card.Root width={"450px"} height={"450px"} p={"5"}>
              <Bar
                width={"400px"}
                height={"400px"}
                data={{
                  datasets: [
                    {
                      data: branchFeeDetails?.map((value) => value.paid),
                      label: "Paid Amount",
                      backgroundColor: "rgba(33,191,91,0.7)",
                      barPercentage: 0.7,
                    },
                    {
                      data: branchFeeDetails?.map((value) => value.remaining),
                      label: "Balance Amount",
                      backgroundColor: "rgba(242,109,109,0.7)",
                      barPercentage: 0.7,
                    },
                  ],
                  labels: branchFeeDetails?.map((value) => value.branch),
                }}
              />
            </Card.Root>
          </HStack>
        ) : (
          <HStack py={"5"} pb={"12"} flexWrap={"wrap"} gap={"3"}>
            {yearFeeDetails && yearFeeDetails.length == 0 && (
              <Card.Root w={"420px"} h={"420px"}>
                <VStack w={"full"} justifyContent={"center"} h={"full"}>
                  <AiOutlineAim className="text-6xl text-purple-500" />
                  <Heading size={"lg"} color={"gray.600"}>
                    No Data Found !
                  </Heading>
                </VStack>
              </Card.Root>
            )}
            {yearFeeDetails &&
              yearFeeDetails.map((yearFee: any) => {
                return (
                  <HStack
                    key={yearFee.year}
                    w={"fit-content"}
                    px={"10"}
                    py={"5"}
                  >
                    <Stat.Root
                      h={"full"}
                      w={"full"}
                      display={"flex"}
                      flexDirection={"row"}
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      <VStack py={"3"}>
                        <h1 className="text-2xl font-bold text-black">
                          {yearFee.year} Year
                        </h1>{" "}
                        <Tag.Root
                          variant={"solid"}
                          size={"lg"}
                          rounded={"full"}
                          colorPalette={"blue"}
                        >
                          {yearFee.total_students} Students
                        </Tag.Root>
                      </VStack>
                      <VStack w={"full"} justifyContent={"center"} gap={"5"}>
                        <Stat.Label
                          py={"2"}
                          alignItems={"center"}
                          display={"flex"}
                          flexDirection={"column"}
                          fontSize={"md"}
                        >
                          Total{" "}
                          <Stat.ValueUnit fontSize={"2xl"}>
                            ₹ {yearFee.total1}
                          </Stat.ValueUnit>
                        </Stat.Label>
                        <Stat.Label
                          py={"2"}
                          alignItems={"center"}
                          display={"flex"}
                          flexDirection={"column"}
                          fontSize={"md"}
                        >
                          Paid{" "}
                          <Stat.ValueUnit fontSize={"2xl"}>
                            ₹ {yearFee.paid1}
                          </Stat.ValueUnit>
                        </Stat.Label>
                        <Stat.Label
                          py={"2"}
                          alignItems={"center"}
                          display={"flex"}
                          flexDirection={"column"}
                          fontSize={"md"}
                        >
                          Balance{" "}
                          <Stat.ValueUnit fontSize={"2xl"}>
                            ₹ {yearFee.remaining1}
                          </Stat.ValueUnit>
                        </Stat.Label>
                      </VStack>
                    </Stat.Root>
                    <Box p={"10"}>
                      <div>
                        <Pie
                          className="chart-bar"
                          options={{ responsive: true }}
                          width={"300px"}
                          height={"300px"}
                          data={{
                            datasets: [
                              {
                                data: [
                                  100,
                                  yearFee?.paid_percentage,
                                  yearFee?.remaining_percentage,
                                ],
                                backgroundColor: [
                                  "rgb(120,55,228,0.7)",
                                  "rgba(33,191,91,0.7)",
                                  "rgba(242,109,109,0.7)",
                                ],
                                type: "pie",
                                label: "Total",
                              },
                            ],
                            labels: [
                              `Total (100%)`,
                              `Paid (${yearFee?.paid_percentage}%)`,
                              `Balance (${yearFee?.remaining_percentage}%)`,
                            ],
                          }}
                        />
                      </div>
                    </Box>
                  </HStack>
                );
              })}
          </HStack>
        )}
      </VStack>
    </div>
  );
}
