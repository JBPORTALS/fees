"use client";
import ISelect from "@/components/ui/utils/ISelect";
import { useAppDispatch } from "@/hooks";
import { useAppSelector } from "@/store";
import { BranchFee, YearFee, fetchBranchFeeDetails, fetchBranchList, fetchFeeYearView } from "@/store/fees.slice";
import {
  Box,
  Card,
  HStack,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  Tag,
  VStack,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { AiOutlineAim } from "react-icons/ai";
import { Pie} from "react-chartjs-2";
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
import { useSupabase } from "@/app/supabase-provider";


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
  const yearFeeDetails = useAppSelector(
    (state) => state.fees.year_fee.data
  ) as YearFee[];
  const user = useSupabase().user
  
  const fetchYearVeiwMemo = useCallback((Ibranch:string)=>{
    dispatch(fetchFeeYearView({branch:Ibranch,college:user?.college!}));
  },[dispatch])

  useEffect(() => {
    fetchYearVeiwMemo(branch)
  }, [branch]);
  

  return (
    <div className={"h-fit w-full"}>
      <div className="w-full backdrop-blur-sm z-20 h-fit flex border-b py-3 sticky top-0 space-x-3 px-5">
        <ISelect
          placeHolder="All"
          value={branch}
          onChange={(value) => setBranch(value as string)}
          options={branch_list.map((option: any) => ({
            option: option.branch,
            value: option.branch,
          }))}
        />
      </div>
      <VStack p={"5"}  h={"fit"}>
        {branch == "All" || !branch ? (
          <HStack>
            <Card width={"450px"} height={"450px"} p={"5"}>
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
            </Card>
          </HStack>
        ) : (
          <HStack py={"5"} pb={"12"} flexWrap={"wrap"} spacing={0} gap={"3"}>
            {yearFeeDetails.length == 0 && (
              <Card w={"420px"} h={"420px"}>
                <VStack w={"full"} justifyContent={"center"} h={"full"}>
                  <AiOutlineAim className="text-6xl text-purple-500" />
                  <Heading size={"lg"} color={"gray.600"}>
                    No Data Found !
                  </Heading>
                </VStack>
              </Card>
            )}
            {yearFeeDetails.map((yearFee) => {
              return (
                <HStack
                  key={yearFee.year}
                  w={"fit-content"}
                  shadow={"lg"}
                  style={{ borderWidth: 1, borderColor: "#dddd" }}
                  px={"10"}
                  py={"5"}
                >
                  <Stat
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
                      <Tag
                        variant={"solid"}
                        size={"lg"}
                        rounded={"full"}
                        colorScheme={"blue"}
                      >
                        {yearFee.total_students} Students
                      </Tag>
                    </VStack>
                    <VStack w={"full"} justifyContent={"center"} spacing={"5"}>
                      <StatLabel
                        py={"2"}
                        alignItems={"center"}
                        display={"flex"}
                        flexDirection={"column"}
                        fontSize={"md"}
                      >
                        Total{" "}
                        <StatNumber fontSize={"2xl"}>
                          ₹ {yearFee.total1}
                        </StatNumber>
                      </StatLabel>
                      <StatLabel
                        py={"2"}
                        alignItems={"center"}
                        display={"flex"}
                        flexDirection={"column"}
                        fontSize={"md"}
                      >
                        Paid{" "}
                        <StatNumber fontSize={"2xl"}>
                          ₹ {yearFee.paid1}
                        </StatNumber>
                      </StatLabel>
                      <StatLabel
                        py={"2"}
                        alignItems={"center"}
                        display={"flex"}
                        flexDirection={"column"}
                        fontSize={"md"}
                      >
                        Balance{" "}
                        <StatNumber fontSize={"2xl"}>
                          ₹ {yearFee.remaining1}
                        </StatNumber>
                      </StatLabel>
                    </VStack>
                  </Stat>
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
