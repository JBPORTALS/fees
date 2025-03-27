"use client";
import {
  Box,
  Card,
  HStack,
  Heading,
  Spinner,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  VStack,
} from "@chakra-ui/react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
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
import { useQueryState, parseAsString, parseAsInteger } from "nuqs";

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

  const [currentIndex, setCurrentIndex] = useQueryState(
    "index",
    parseAsInteger.withDefault(0).withOptions({ clearOnDefault: true })
  );

  return (
    <Stack h={"full"} w={"full"} justifyContent={"start"}>
      <VStack alignItems={"start"} h={"fit-content"}>
        <Heading size={"lg"}>Grand Total</Heading>
        <HStack>
          <Card
            style={{ borderWidth: 2, borderColor: "white" }}
            w={"fit-content"}
            p={"10"}
            borderWidth={"2"}
            borderColor={"purple.700"}
            className={
              "bg-gradient-to-tr from-gray-900 via-purple-900 to-violet-600"
            }
          >
            <Stat
              as={"div"}
              borderWidth={"1"}
              borderColor={"purple.700"}
              h={"full"}
              w={"full"}
              className={"backdrop-blur-lg bg-[rgba(255,255,255,0.8)"}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <StatLabel py={"2"} color={"white"} fontSize={"lg"}>
                Amount
              </StatLabel>
              <StatNumber fontSize={"3xl"} className={"text-white"}>
                ₹ {overallFeeDetails[0]?.total}
              </StatNumber>
            </Stat>
          </Card>
          <Card
            style={{ borderWidth: 2, borderColor: "white" }}
            w={"fit-content"}
            p={"10"}
            className={"bg-gradient-to-tr to-green-500 from-green-900"}
          >
            <Stat
              h={"full"}
              w={"full"}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <StatLabel py={"2"} color={"white"} fontSize={"lg"}>
                Amount Paid
              </StatLabel>
              <StatNumber fontSize={"3xl"} className={"text-white"}>
                ₹ {overallFeeDetails[0]?.paid}
              </StatNumber>
            </Stat>
          </Card>
          <Card
            style={{ borderWidth: 2, borderColor: "white" }}
            width={"190px"}
            className="bg-gradient-to-tr to-red-400 from-red-900"
            w={"fit-content"}
            p={"10"}
          >
            <Stat
              h={"full"}
              w={"full"}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <StatLabel py={"2"} fontSize={"lg"} color={"white"}>
                Amount To Be Paid
              </StatLabel>
              <StatNumber fontSize={"3xl"} className={"text-white"}>
                ₹ {overallFeeDetails[0]?.remaining}
              </StatNumber>
            </Stat>
          </Card>
        </HStack>
      </VStack>

      <Tabs
        defaultIndex={currentIndex}
        index={currentIndex}
        onChange={(index) => setCurrentIndex(index)}
      >
        <TabList>
          <Tab>All Branches</Tab>
          <Tab>All Years</Tab>
        </TabList>
        <TabPanels px={0}>
          <TabPanel>
            {isBranchFeePending ? (
              <Stack w={"100%"} justifyContent={"center"} alignItems={"center"}>
                <Spinner size={"lg"} color="blue" />
              </Stack>
            ) : (
              <VStack py={"5"} w={"full"} alignItems={"start"}>
                <Heading size={"lg"}>
                  All {user?.college == "HOSTEL" ? "Colleges" : "Branches"}
                </Heading>
                <HStack
                  py={"5"}
                  pb={"12"}
                  flexWrap={"wrap"}
                  spacing={0}
                  gap={"3"}
                  justifyContent={"center"}
                >
                  {branchFeeDetails.map((branchFee) => {
                    return (
                      <Card
                        key={branchFee.branch}
                        w={"580px"}
                        shadow={"lg"}
                        style={{ borderWidth: 1, borderColor: "#dddd" }}
                        px={"10"}
                        py={"5"}
                        display={"flex"}
                      >
                        <Stat
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
                                <Tag
                                  variant={"solid"}
                                  size={"lg"}
                                  rounded={"full"}
                                  colorScheme={"blue"}
                                >
                                  {branchFee.total_students} Students
                                </Tag>
                              </VStack>
                              <VStack w={"full"} justifyContent={"center"}>
                                <StatLabel
                                  py={"2"}
                                  alignItems={"center"}
                                  display={"flex"}
                                  flexDirection={"column"}
                                  fontSize={"md"}
                                >
                                  Total{" "}
                                  <StatNumber fontSize={"lg"}>
                                    ₹ {branchFee.total1}
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
                                  <StatNumber fontSize={"lg"}>
                                    ₹ {branchFee.paid1}
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
                                  <StatNumber fontSize={"lg"}>
                                    ₹ {branchFee.remaining1}
                                  </StatNumber>
                                </StatLabel>
                              </VStack>
                            </VStack>
                            <Box p={"10"}>
                              <div>
                                <Pie
                                  className="chart-bar"
                                  options={{ responsive: true }}
                                  width={"250px"}
                                  height={"250px"}
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
                              </div>
                            </Box>
                          </HStack>
                        </Stat>
                      </Card>
                    );
                  })}
                </HStack>
              </VStack>
            )}
          </TabPanel>
          <TabPanel px={0} className="w-full">
            {isYearsFeePending ? (
              <Stack w={"100%"} justifyContent={"center"} alignItems={"center"}>
                <Spinner size={"lg"} color="blue" />
              </Stack>
            ) : (
              <VStack py={"5"} w={"full"} alignItems={"start"}>
                <Heading size={"lg"}>
                  All {user?.college == "HOSTEL" ? "Colleges" : "Years"}
                </Heading>
                <HStack
                  py={"5"}
                  pb={"12"}
                  flexWrap={"wrap"}
                  spacing={0}
                  gap={"3"}
                  justifyContent={"center"}
                >
                  {feeYearsDetails.map((yearFee) => {
                    return (
                      <Card
                        key={yearFee.branch}
                        w={"580px"}
                        shadow={"lg"}
                        style={{ borderWidth: 1, borderColor: "#dddd" }}
                        px={"10"}
                        py={"5"}
                        display={"flex"}
                      >
                        <Stat
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
                                <Tag
                                  variant={"solid"}
                                  size={"lg"}
                                  rounded={"full"}
                                  colorScheme={"blue"}
                                >
                                  {yearFee.total_students} Students
                                </Tag>
                              </VStack>
                              <VStack w={"full"} justifyContent={"center"}>
                                <StatLabel
                                  py={"2"}
                                  alignItems={"center"}
                                  display={"flex"}
                                  flexDirection={"column"}
                                  fontSize={"md"}
                                >
                                  Total{" "}
                                  <StatNumber fontSize={"lg"}>
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
                                  <StatNumber fontSize={"lg"}>
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
                                  <StatNumber fontSize={"lg"}>
                                    ₹ {yearFee.remaining1}
                                  </StatNumber>
                                </StatLabel>
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
                        </Stat>
                      </Card>
                    );
                  })}
                </HStack>
              </VStack>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Stack>
  );
}
