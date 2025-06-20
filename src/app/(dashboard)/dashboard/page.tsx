"use client";

import {
  Box,
  Card,
  HStack,
  Heading,
  SimpleGrid,
  Spinner,
  Stack,
  Stat,
  Tabs,
  Tag,
  VStack,
} from "@chakra-ui/react";

import { BranchFee, OverallFee } from "@/store/fees.slice";
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
import { useAppSelector } from "@/store";
import { useUser } from "@/utils/auth";
import React from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Home() {
  const overallFeeDetails = useAppSelector(
    (state) => state.fees.overall_fee.data
  ) as OverallFee[];
  const branchFeeDetails = useAppSelector(
    (state) => state.fees.branch_fee.data
  ) as BranchFee[];
  const isBranchFeePending = useAppSelector(
    (state) => state.fees.branch_fee.pending
  );
  const isYearsFeePending = useAppSelector(
    (state) => state.fees.fee_retrieve_years.pending
  );
  const feeYearsDetails = useAppSelector(
    (state) => state.fees.fee_retrieve_years.data
  ) as any[];
  const user = useUser();

  return (
    <React.Fragment>
      <VStack alignItems={"start"} h={"fit-content"}>
        <Heading size={"3xl"}>Grand Total</Heading>
        <HStack>
          <Card.Root size={"lg"} minH={"130px"} minW={"2xs"}>
            <Card.Body asChild>
              <Stat.Root>
                <Stat.Label>Amount</Stat.Label>
                <Stat.ValueText>₹ {overallFeeDetails[0]?.total}</Stat.ValueText>
              </Stat.Root>
            </Card.Body>
          </Card.Root>

          <Card.Root size={"lg"} minH={"130px"} minW={"2xs"}>
            <Card.Body asChild>
              <Stat.Root>
                <Stat.Label>Amount Paid</Stat.Label>
                <Stat.ValueText>₹ {overallFeeDetails[0]?.paid}</Stat.ValueText>
              </Stat.Root>
            </Card.Body>
          </Card.Root>

          <Card.Root size={"lg"} minH={"130px"} minW={"2xs"}>
            <Card.Body asChild>
              <Stat.Root>
                <Stat.Label>Amount Balance</Stat.Label>
                <Stat.ValueText>
                  {" "}
                  ₹ {overallFeeDetails[0]?.remaining}
                </Stat.ValueText>
              </Stat.Root>
            </Card.Body>
          </Card.Root>
        </HStack>
      </VStack>

      {/** Sub tabs */}
      <Tabs.Root defaultValue={"all-branches"} size={"sm"} variant={"enclosed"}>
        <Tabs.List>
          <Tabs.Trigger value={"all-branches"}>All Branches</Tabs.Trigger>
          <Tabs.Trigger value={"all-years"}>All Years</Tabs.Trigger>
        </Tabs.List>
        <Tabs.ContentGroup px={0}>
          <Tabs.Content value={"all-branches"}>
            {isBranchFeePending ? (
              <Stack w={"100%"} justifyContent={"center"} alignItems={"center"}>
                <Spinner size={"lg"} color="blue" />
              </Stack>
            ) : (
              <VStack w={"full"} alignItems={"start"}>
                <Heading size={"2xl"}>
                  All {user?.college == "HOSTEL" ? "Colleges" : "Branches"}
                </Heading>
                <SimpleGrid
                  w={"full"}
                  gap={"3"}
                  columns={2}
                  justifyContent={"center"}
                >
                  {branchFeeDetails.map((branchFee) => {
                    return (
                      <Card.Root
                        key={branchFee.branch}
                        w={"full"}
                        px={"10"}
                        py={"5"}
                      >
                        <Stat.Root
                          h={"full"}
                          w={"full"}
                          display={"flex"}
                          flexDirection={"column"}
                          justifyContent={"center"}
                          alignItems={"center"}
                        >
                          <HStack>
                            <VStack>
                              <VStack py={"3"}>
                                <h1 className="text-xl font-medium text-black">
                                  {
                                    branchFee[
                                      user?.college == "HOSTEL"
                                        ? "college"
                                        : "branch"
                                    ]
                                  }
                                </h1>{" "}
                                <Tag.Root
                                  variant={"solid"}
                                  size={"lg"}
                                  rounded={"full"}
                                  colorPalette={"blue"}
                                >
                                  <Tag.Label>
                                    {branchFee.total_students} Students
                                  </Tag.Label>
                                </Tag.Root>
                              </VStack>
                              <VStack w={"full"} justifyContent={"center"}>
                                <Stat.Label
                                  py={"2"}
                                  alignItems={"center"}
                                  display={"flex"}
                                  flexDirection={"column"}
                                  fontSize={"md"}
                                >
                                  Total{" "}
                                  <Stat.ValueUnit fontSize={"lg"}>
                                    ₹ {branchFee.total1}
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
                                  <Stat.ValueUnit fontSize={"lg"}>
                                    ₹ {branchFee.paid1}
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
                                  <Stat.ValueUnit fontSize={"lg"}>
                                    ₹ {branchFee.remaining1}
                                  </Stat.ValueUnit>
                                </Stat.Label>
                              </VStack>
                            </VStack>
                            <Box>
                              <Pie
                                className="chart-bar"
                                options={{ responsive: true }}
                                width={"50px"}
                                height={"50px"}
                                style={{ minHeight: 250, minWidth: 250 }}
                                data={{
                                  datasets: [
                                    {
                                      data: [
                                        branchFee?.total,
                                        branchFee?.paid,
                                        branchFee?.remaining,
                                      ],
                                      backgroundColor: [
                                        "rgb(120,55,228,0.7)",
                                        "rgba(33,191,91,0.7)",
                                        "rgba(242,109,109,0.7)",
                                      ],
                                      type: "pie",
                                    },
                                  ],
                                  labels: ["Total", "Paid", "Balance"],
                                }}
                              />
                            </Box>
                          </HStack>
                        </Stat.Root>
                      </Card.Root>
                    );
                  })}
                </SimpleGrid>
              </VStack>
            )}
          </Tabs.Content>
          <Tabs.Content value={"all-years"} px={0} className="w-full">
            {isYearsFeePending ? (
              <Stack w={"100%"} justifyContent={"center"} alignItems={"center"}>
                <Spinner size={"lg"} color="blue" />
              </Stack>
            ) : (
              <VStack w={"full"} alignItems={"start"}>
                <Heading size={"2xl"}>
                  All {user?.college == "HOSTEL" ? "Colleges" : "Years"}
                </Heading>
                <SimpleGrid
                  w={"full"}
                  gap={"3"}
                  columns={2}
                  justifyContent={"center"}
                >
                  {feeYearsDetails.map((yearFee) => {
                    return (
                      <Card.Root
                        key={yearFee.branch}
                        w={"full"}
                        px={"10"}
                        py={"5"}
                        display={"flex"}
                      >
                        <Stat.Root
                          h={"full"}
                          w={"full"}
                          display={"flex"}
                          flexDirection={"column"}
                          justifyContent={"center"}
                          alignItems={"center"}
                        >
                          <HStack>
                            <VStack>
                              <VStack py={"3"}>
                                <h1 className="text-xl font-medium text-black">
                                  {yearFee.year} Year
                                </h1>{" "}
                                <Tag.Root
                                  variant={"solid"}
                                  size={"lg"}
                                  rounded={"full"}
                                  colorPalette={"blue"}
                                >
                                  <Tag.Label>
                                    {yearFee.total_students} Students
                                  </Tag.Label>
                                </Tag.Root>
                              </VStack>
                              <VStack w={"full"} justifyContent={"center"}>
                                <Stat.Label
                                  py={"2"}
                                  alignItems={"center"}
                                  display={"flex"}
                                  flexDirection={"column"}
                                  fontSize={"md"}
                                >
                                  Total{" "}
                                  <Stat.ValueUnit fontSize={"lg"}>
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
                                  <Stat.ValueUnit fontSize={"lg"}>
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
                                  <Stat.ValueUnit fontSize={"lg"}>
                                    ₹ {yearFee.remaining1}
                                  </Stat.ValueUnit>
                                </Stat.Label>
                              </VStack>
                            </VStack>
                            <Box p={"10"}>
                              <div>
                                <Pie
                                  className="chart-bar"
                                  options={{ responsive: true }}
                                  width={"250px"}
                                  height={"290px"}
                                  style={{
                                    height: 250,
                                    minHeight: 250,
                                    minWidth: 250,
                                    width: 250,
                                  }}
                                  data={{
                                    datasets: [
                                      {
                                        data: [
                                          yearFee?.total,
                                          yearFee?.paid,
                                          yearFee?.remaining,
                                        ],
                                        backgroundColor: [
                                          "rgb(120,55,228,0.7)",
                                          "rgba(33,191,91,0.7)",
                                          "rgba(242,109,109,0.7)",
                                        ],
                                        type: "pie",
                                      },
                                    ],
                                    labels: ["Total", "Paid", "Balance"],
                                  }}
                                />
                              </div>
                            </Box>
                          </HStack>
                        </Stat.Root>
                      </Card.Root>
                    );
                  })}
                </SimpleGrid>
              </VStack>
            )}
          </Tabs.Content>
        </Tabs.ContentGroup>
      </Tabs.Root>
    </React.Fragment>
  );
}
