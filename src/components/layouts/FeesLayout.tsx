import { useAppDispatch } from "@/hooks";
import { useAppSelector } from "@/store";
import {
  BranchFee,
  fetchBranchFeeDetails,
  fetchFeeDetails,
  fetchFeeYearView,
  fetchOverAllFee,
  OverallFee,
  YearFee,
} from "@/store/fees.slice";
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
import {
  Avatar,
  Box,
  Button,
  Card,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuList,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Skeleton,
  Stat,
  StatLabel,
  StatNumber,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { InfoCard } from "../ui/utils/InfoCard";
import ISelect from "../ui/utils/ISelect";
import { Pie, Bar } from "react-chartjs-2";
import {
  AiOutlineAim,
  AiOutlineDollarCircle,
  AiOutlineFieldTime,
  AiOutlineFilePdf,
  AiOutlineFilter,
  AiOutlineLogout,
  AiOutlineMail,
  AiOutlineSearch,
  AiOutlineSend,
  AiOutlineUser,
} from "react-icons/ai";
import GenerateRecieptModal from "../modals/GenerateRecieptModal";
import IModal from "../ui/utils/IModal";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useSupabase } from "@/app/supabase-provider";
import moment from "moment";

interface AttendanceLayoutProps {
  children: React.ReactNode;
  isFor: "admin" | "coadmin" | "staff";
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function FeesLayout({
  children,
  isFor = "admin",
}: AttendanceLayoutProps) {
  const dispatch = useAppDispatch();
  const branchFeeDetails = useAppSelector(
    (state) => state.fees.branch_fee.data
  ) as BranchFee[];
  const yearFeeDetails = useAppSelector(
    (state) => state.fees.year_fee.data
  ) as YearFee[];
  const branch_list = useAppSelector(
    (state) => state.fees.branch_list.data
  ) as [];
  const overallFeeDetails = useAppSelector(
    (state) => state.fees.overall_fee.data
  ) as OverallFee[];
  const [state, setState] = useState({
    branch: "",
    year: "",
  });
  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    isOpen: isProfileOpen,
    onClose: onProfileClose,
    onOpen: onProfileOpen,
  } = useDisclosure();
  const [branch, setBranch] = useState<string | undefined>("All");
  const [filterType, setFilterType] = useState<string>("");
  const [filterState, setFilterState] = useState({
    date: "",
    challan_no: "0",
  });
  const [filteredData, setFilteredData] = useState<
    | {
        challan_id: string;
        usn: string;
        name: string;
        date: string;
        method: string;
        amount_paid1: string;
      }[]
    | null
  >(null);
  const [isloading, setIsLoading] = useState(true);
  const { user, supabase } = useSupabase();

  useEffect(() => {
    if (state.branch && state.year)
      dispatch(fetchFeeDetails({ branch: state.branch, year: state.year }));

    dispatch(fetchBranchFeeDetails());
    dispatch(fetchOverAllFee());
  }, [state.branch, state.year, dispatch]);

  useEffect(() => {
    branch && dispatch(fetchFeeYearView({ branch }));
  }, [branch, dispatch]);

  const onSubmitSendMessage = async () => {};

  const onDateFilter = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("date", filterState.date);
      const response = await axios(
        process.env.NEXT_PUBLIC_ADMIN_URL +
          `${
            filterType == "CHALLAN_DATE" ? "feesearchdate" : "feesearchpaiddate"
          }.php`,
        {
          method: "POST",
          data: formData,
        }
      );
      setFilteredData(response.data);
    } catch (e: any) {
      onClose();
      toast.error(e.response?.data?.msg);
      setFilteredData(null);
    }
    setIsLoading(false);
  };

  const onChallanFilter = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("challan_id", filterState.challan_no);
      const response = await axios(
        process.env.NEXT_PUBLIC_ADMIN_URL + "feechallanfilter.php",
        {
          method: "POST",
          data: formData,
        }
      );
      setFilteredData(response.data);
    } catch (e: any) {
      onClose();
      toast.error(e.response?.data?.msg);
      setFilteredData(null);
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-primary overflow-hidden w-full  h-full flex flex-col">
      <HStack
        w={"full"}
        px={"5"}
        justifyContent={"space-between"}
        h={"14"}
        className="bg-secondary border-b border-b-lightgray"
      >
        <HStack color={"blue.600"}>
          <AiOutlineDollarCircle className="text-3xl" />
          <Heading size={"md"}>Fee Manager</Heading>
        </HStack>
        <HStack>
          <HStack>
            <HStack>
              <Heading size={"md"}>{user?.username}</Heading>
              <IconButton
                onClick={onProfileOpen}
                variant={"unstyled"}
                aria-label="avatar"
              >
                <Avatar size={"sm"}></Avatar>
              </IconButton>
            </HStack>
            <Modal isOpen={isProfileOpen} size={"sm"} onClose={onProfileClose}>
              <ModalOverlay className="backdrop-blur-sm" />
              <ModalContent
                position={"relative"}
                zIndex={"toast"}
                backdropBlur={"2xl"}
                shadow={"2xl"}
              >
                <ModalHeader fontWeight="semibold" fontSize={"lg"}>
                  Profile Info
                </ModalHeader>
                <ModalBody>
                  <HStack spacing={"3"} py={"2"}>
                    <AiOutlineUser className="text-2xl" />
                    <Heading size={"sm"} fontWeight={"normal"}>
                      {user?.username}
                    </Heading>
                  </HStack>
                  <HStack spacing={"3"} py={"2"}>
                    <AiOutlineMail className="text-2xl" />
                    <Heading size={"sm"} fontWeight={"normal"}>
                      {user?.email}
                    </Heading>
                  </HStack>
                  <HStack spacing={"3"} py={"2"}>
                    <AiOutlineFieldTime className="text-2xl" />
                    <Heading size={"sm"} fontWeight={"normal"}>
                      {moment(user?.last_login_at).format(
                        "MMMM Do YYYY, h:mm a"
                      )}
                    </Heading>
                  </HStack>
                  <HStack spacing={"3"} py={"2"}>
                    <Button
                      leftIcon={<AiOutlineLogout />}
                      onClick={async () => {
                        await supabase
                          .from("profiles")
                          .update({ last_login_at: new Date(Date.now()) })
                          .eq("id", user?.session?.user.id);
                        await supabase.auth.signOut();
                      }}
                      colorScheme="facebook"
                      w={"full"}
                    >
                      SignOut
                    </Button>
                  </HStack>
                </ModalBody>
              </ModalContent>
            </Modal>
          </HStack>
        </HStack>
      </HStack>
      <Tabs
        colorScheme={"purple"}
        size={"sm"}
        variant={"solid-rounded"}
        h={"full"}
        pt={"4"}
      >
        <TabList className="px-5">
          <HStack justifyContent={"space-between"} w={"full"}>
            <HStack>
              <Tab
                style={{ outlineColor: "#4945FF", outlineWidth: 1 }}
                _selected={{ bg: "#4945FF", color: "#ffff" }}
              >
                Overall
              </Tab>
              <Tab
                style={{
                  outlineColor: "#4945FF",
                  outlineWidth: 1,
                  marginLeft: "15px",
                }}
                _selected={{ bg: "#4945FF", color: "#ffff" }}
              >
                Branch Wise
              </Tab>
              <Tab
                style={{
                  outlineColor: "#4945FF",
                  outlineWidth: 1,
                  marginLeft: "15px",
                }}
                _selected={{ bg: "#4945FF", color: "#ffff" }}
              >
                Class Wise
              </Tab>
            </HStack>
            <HStack>
              <IModal
                hideBtn
                size={"2xl"}
                isOpen={isOpen}
                onClose={onClose}
                heading={"Search Result"}
              >
                <VStack w={"full"}>
                  {isloading
                    ? new Array(6).fill(0).map((_value, key) => {
                        return (
                          <Skeleton key={key} w={"full"} h={"16"}></Skeleton>
                        );
                      })
                    : filteredData?.map((paymentData, index) => {
                        return (
                          <HStack
                            key={paymentData.challan_id + index}
                            w={"full"}
                            className={"border-b border-b-lightgray"}
                            bg={"gray.50"}
                            px={"5"}
                            py={"2"}
                          >
                            <VStack flex={1} alignItems={"start"}>
                              <HStack justifyContent={"start"}>
                                <VStack
                                  justifyContent={"start"}
                                  alignItems={"start"}
                                >
                                  <Heading
                                    size={"sm"}
                                    textTransform={"capitalize"}
                                    whiteSpace={"nowrap"}
                                  >
                                    {paymentData?.name.toString().toLowerCase()} (
                                    {paymentData?.usn})
                                  </Heading>
                                  <Tag
                                    size={"md"}
                                    variant={"outline"}
                                    colorScheme={"teal"}
                                    fontWeight={"bold"}
                                  >
                                    CH No. {paymentData.challan_id}
                                  </Tag>
                                </VStack>
                              </HStack>
                              <span className="text-sm">
                                {paymentData.date}
                              </span>
                            </VStack>
                            <VStack flex={1} alignItems={"end"}>
                              <h1 className="text-xl font-bold text-green-600">
                                ₹{paymentData.amount_paid1}
                              </h1>
                              <span className="text-md font-medium">
                                <i>{paymentData.method}</i>
                              </span>
                            </VStack>
                          </HStack>
                        );
                      })}
                </VStack>
              </IModal>
              <Menu size={"lg"}>
                <MenuButton>
                  <Button
                    as={"view"}
                    size={"sm"}
                    shadow={"md"}
                    leftIcon={<AiOutlineFilter className={"text-xl"} />}
                    colorScheme={"teal"}
                  >
                    Filter
                  </Button>
                </MenuButton>
                <MenuList position={"absolute"} zIndex={"dropdown"}>
                  <VStack px={"4"}>
                    <FormControl>
                      <Select onChange={(e) => setFilterType(e.target.value)}>
                        <option value={""}>Select Filter</option>
                        <option value={"CHALLAN_DATE"}>By Challan Date</option>
                        <option value={"PAID_DATE"}>By Paid Date</option>
                        <option value={"CHALLAN"}>By Challan No.</option>
                      </Select>
                    </FormControl>
                    {filterType && (
                      <>
                        <FormControl>
                          {filterType == "CHALLAN" ? (
                            <>
                              <FormLabel>Challan No.</FormLabel>
                              <Input
                                value={filterState.challan_no}
                                type={"number"}
                                onChange={(e) => {
                                  const value = Math.max(
                                    0,
                                    Math.min(1500000, Number(e.target.value))
                                  );
                                  setFilterState((prev) => ({
                                    ...prev,
                                    challan_no: value.toString(),
                                  }));
                                }}
                              />
                            </>
                          ) : filterType == "PAID_DATE" ||
                            filterType == "CHALLAN_DATE" ? (
                            <>
                              <FormLabel>Date</FormLabel>
                              <Input
                                value={filterState.date}
                                onChange={(e) =>
                                  setFilterState((prev) => ({
                                    ...prev,
                                    date: e.target.value,
                                  }))
                                }
                                type={"date"}
                              />
                            </>
                          ) : null}
                        </FormControl>
                        <FormControl>
                          <Button
                            onClick={() => {
                              switch (filterType) {
                                case "CHALLAN":
                                  onChallanFilter();
                                  break;
                                case "CHALLAN_DATE":
                                  onDateFilter();
                                  break;
                                case "PAID_DATE":
                                  onDateFilter();
                                  break;
                                default:
                                  return;
                              }
                              onOpen();
                            }}
                            colorScheme={"blue"}
                            rightIcon={
                              <AiOutlineSearch className={"text-lg"} />
                            }
                            w={"full"}
                          >
                            Search
                          </Button>
                        </FormControl>
                      </>
                    )}
                  </VStack>
                </MenuList>
              </Menu>
              {state.branch && state.year && (
                <Menu size={"lg"}>
                  <MenuButton>
                    <Button
                      as={"view"}
                      size={"sm"}
                      shadow={"md"}
                      leftIcon={<AiOutlineSend className={"text-xl"} />}
                      colorScheme={"orange"}
                    >
                      Notify Balance Fee Students
                    </Button>
                  </MenuButton>
                  <MenuList position={"absolute"} zIndex={"tooltip"}>
                    <VStack px={"4"}>
                      <FormControl>
                        <FormLabel>Final date to pay</FormLabel>
                        <Input type={"date"} />
                      </FormControl>
                      <FormControl>
                        <Button
                          colorScheme={"blue"}
                          rightIcon={<AiOutlineSend className={"text-lg"} />}
                          w={"full"}
                        >
                          Send
                        </Button>
                      </FormControl>
                    </VStack>
                  </MenuList>
                </Menu>
              )}
              <GenerateRecieptModal>
                {({ onOpen }) => (
                  <Button
                    onClick={onOpen}
                    size={"sm"}
                    shadow={"md"}
                    variant={"outline"}
                    leftIcon={<AiOutlineFilePdf className={"text-xl"} />}
                    colorScheme={"whatsapp"}
                  >
                    Generate Reciept
                  </Button>
                )}
              </GenerateRecieptModal>
            </HStack>
          </HStack>
        </TabList>
        <TabPanels px={"5"}>
          <TabPanel>
            <VStack alignItems={"start"}>
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
            <VStack py={"5"} alignItems={"start"}>
              <Heading size={"lg"}>All Branches</Heading>
              <HStack
                py={"5"}
                pb={"12"}
                flexWrap={"wrap"}
                spacing={0}
                gap={"3"}
              >
                {branchFeeDetails.map((branchFee) => {
                  return (
                    <Card
                      key={branchFee.branch}
                      w={"530px"}
                      shadow={"lg"}
                      style={{ borderWidth: 1, borderColor: "#dddd" }}
                      px={"10"}
                      py={"5"}
                    >
                      <Stat
                        h={"full"}
                        w={"full"}
                        display={"flex"}
                        justifyContent={"center"}
                        alignItems={"center"}
                      >
                        <VStack py={"3"}>
                          <h1 className="text-2xl font-bold text-black">
                            {branchFee.branch}
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
                        <HStack
                          w={"full"}
                          justifyContent={"center"}
                          spacing={"5"}
                        >
                          <StatLabel
                            py={"2"}
                            alignItems={"center"}
                            display={"flex"}
                            flexDirection={"column"}
                            fontSize={"md"}
                          >
                            Total{" "}
                            <StatNumber fontSize={"2xl"}>
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
                            <StatNumber fontSize={"2xl"}>
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
                            <StatNumber fontSize={"2xl"}>
                              ₹ {branchFee.remaining1}
                            </StatNumber>
                          </StatLabel>
                        </HStack>
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
                      </Stat>
                    </Card>
                  );
                })}
              </HStack>
            </VStack>
          </TabPanel>
          <TabPanel px={0}>
            <div className="w-full flex border-b py-2 space-x-3 px-5">
              <ISelect
                placeHolder="All"
                value={state.branch}
                onChange={(value) => setBranch(value)}
                options={branch_list.map((option: any) => ({
                  option: option.branch,
                  value: option.branch,
                }))}
              />
            </div>
            <VStack p={"5"}>
              {branch == "" ? (
                <HStack>
                  <Card width={"450px"} height={"450px"} p={"5"}>
                    <Bar
                      width={"400px"}
                      height={"400px"}
                      data={{
                        datasets: [
                          {
                            data: branchFeeDetails?.map((value) => value.paid),
                            label: "Paid Ammount",
                            backgroundColor: "rgba(33,191,91,0.7)",
                            barPercentage: 0.7,
                          },
                          {
                            data: branchFeeDetails?.map(
                              (value) => value.remaining
                            ),
                            label: "Balance Ammount",
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
                <HStack
                  py={"5"}
                  pb={"12"}
                  flexWrap={"wrap"}
                  spacing={0}
                  gap={"3"}
                >
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
                          <VStack
                            w={"full"}
                            justifyContent={"center"}
                            spacing={"5"}
                          >
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
          </TabPanel>
          <TabPanel px={0} w={"100vw"} h={"88vh"}>
            <div className="w-full flex border-b py-2 space-x-3 px-5">
              {isFor == "admin" || isFor == "staff" ? (
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
              ) : null}

              {isFor == "admin" || (isFor == "staff" && state.branch) ? (
                <ISelect
                  placeHolder="Year"
                  value={state.year}
                  onChange={(value) =>
                    setState((prev) => ({ ...prev, year: value as string }))
                  }
                  options={[
                    { value: "1", option: "1" },
                    { value: "2", option: "2" },
                  ]}
                />
              ) : null}
            </div>
            <VStack className="w-full h-full" spacing={0}>
              {(isFor == "admin" && !state.branch) ||
              (isFor == "staff" && !state.branch) ? (
                <InfoCard message="Select Branch" />
              ) : (isFor == "admin" && state.branch && !state.year) ||
                (isFor == "staff" && !state.branch) ? (
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
                {isFor == "admin" && state.branch && state.year && children}
              </VStack>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}
