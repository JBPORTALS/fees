import { useAppDispatch } from "@/hooks";
import { useAppSelector } from "@/store";
import { fetchBranchList, updateUSN } from "@/store/fees.slice";
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
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Menu,
  MenuButton,
  MenuList,
  Select,
  Skeleton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import {
  AiOutlineFilePdf,
  AiOutlineFilter,
  AiOutlineSearch,
} from "react-icons/ai";
import IModal from "../ui/utils/IModal";
import { toast } from "react-hot-toast";
import axios from "axios";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import { usePathname, useRouter } from "next/navigation";
import { Link } from "@chakra-ui/next-js";
import { shallowEqual } from "react-redux";

interface AttendanceLayoutProps {
  children: React.ReactNode;
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

export default function FeesLayout({ children }: AttendanceLayoutProps) {
  const dispatch = useAppDispatch();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [modeFilterState, setModeFilterState] = useState<{
    branch: string;
    sem: string;
    mode: string;
    fromDate: Date | null;
    toDate: Date | null;
    type: string;
  }>({
    branch: "ALL",
    sem: "ALL",
    mode: "ALL",
    fromDate: new Date(),
    toDate: new Date(),
    type: "ALL",
  });

  const branchList = useAppSelector(
    (state) => state.fees.branch_list.data,
    shallowEqual
  ) as [];

  const [filterType, setFilterType] = useState<string>("");
  const [filterState, setFilterState] = useState<{
    challan_no: string;
    date: Date | null;
  }>({
    date: new Date(),
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
  const [isPushing, setIsPushing] = useState(false);
  const isUpdatingUSN = useAppSelector(
    (state) => state.fees.update_usn.pending
  ) as boolean;
  const [usn, setUSN] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  const fetchBranchListCb = useCallback(() => {
    dispatch(fetchBranchList());
  }, []);

  useEffect(() => {
    fetchBranchListCb();
  }, [isOpen]);

  const onDateFilter = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("date", moment(filterState.date).format("yyyy-MM-DD"));
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

  const onModeFilter = async () => {
    setIsPushing(true);
    router.replace(
      `/dashboard/search?branch=${modeFilterState.branch}&sem=${
        modeFilterState.sem
      }&mode=${modeFilterState.mode}&feeType=${modeFilterState.type}&fromDate=${moment(
        modeFilterState.fromDate
      ).format("DD-MM-yyyy")}&toDate=${moment(modeFilterState.toDate).format(
        "DD-MM-yyyy"
      )}&hash=${new Date().getTime()}`
    );
    setIsPushing(false);
  };

  return (
    <div className="bg-primary relative overflow-hidden w-full  h-full flex flex-col">
      <Tabs
        index={
          pathname == "/dashboard"
            ? 0
            : pathname === "/dashboard/branchview"
            ? 1
            : pathname === "/dashboard/classview"
            ? 2
            : pathname.startsWith("/dashboard/search")
            ? 3
            : -1
        }
        colorScheme={"facebook"}
        size={"lg"}
        variant={"line"}
        h={"full"}
      >
        <TabList
          zIndex={"sticky"}
          position={"sticky"}
          bg={"whiteAlpha.100"}
          backdropBlur={"sm"}
          w={"100vw"}
          className="px-5 border-b border-gray-300 bg-[rgba(255,255,255,0.5)] backdrop-blur-sm flex justify-between"
        >
          <HStack justifyContent={"space-between"} w={"full"}>
            <HStack>
              <Tab
                as={Link}
                href={"/dashboard"}
                _hover={{ textDecoration: "none" }}
              >
                Overall
              </Tab>
              <Tab
                as={Link}
                href={"/dashboard/branchview"}
                _hover={{ textDecoration: "none" }}
              >
                Branch Wise
              </Tab>
              <Tab
                as={Link}
                href={"/dashboard/classview"}
                _hover={{ textDecoration: "none" }}
              >
                Class Wise
              </Tab>
              <Tab hidden _hover={{ textDecoration: "none" }}>
                Search
              </Tab>
            </HStack>

            <HStack zIndex={"sticky"}>
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
                          <>
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
                                      {paymentData?.name
                                        .toString()
                                        .toLowerCase()}{" "}
                                      {paymentData.usn ? (
                                        `(${paymentData.usn})`
                                      ) : (
                                        <Input
                                          size={"sm"}
                                          px={"3"}
                                          value={usn}
                                          onChange={(e) =>
                                            setUSN(e.target.value)
                                          }
                                          variant={"flushed"}
                                          placeholder="Enter USN here ..."
                                        />
                                      )}
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
                                <Box>
                                  <h1 className="text-xl font-bold text-green-600">
                                    ₹{paymentData.amount_paid1}
                                  </h1>
                                  <span className="text-md font-medium">
                                    <i>{paymentData.method}</i>
                                  </span>
                                </Box>
                              </VStack>
                            </HStack>
                            {!paymentData.usn && (
                              <Button
                                w={"full"}
                                colorScheme="blue"
                                onClick={() => {
                                  dispatch(
                                    updateUSN({
                                      challan_no: paymentData.challan_id,
                                      usn,
                                    })
                                  ).then(() => {
                                    onChallanFilter();
                                  });
                                }}
                                isLoading={isUpdatingUSN}
                              >
                                Save USN No.
                              </Button>
                            )}
                          </>
                        );
                      })}
                </VStack>
              </IModal>
              <Menu size={"lg"}>
                <MenuButton position={"sticky"} zIndex={"popover"}>
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
                <MenuList zIndex={"popover"} pos={"sticky"}>
                  <VStack px={"4"}>
                    <FormControl>
                      <Select onChange={(e) => setFilterType(e.target.value)}>
                        <option value={""}>Select Filter</option>
                        <option value={"CHALLAN_DATE"}>By Challan Date</option>
                        <option value={"PAID_DATE"}>By Paid Date</option>
                        <option value={"CHALLAN"}>By Challan No.</option>
                        <option value={"MODE"}>By Mode</option>
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
                              <ReactDatePicker
                                className="px-3 flex shadow-md justify-self-end w-[100%] ml-auto py-2 border rounded-md outline-brand"
                                selected={
                                  !filterState.date
                                    ? new Date()
                                    : new Date(filterState.date)
                                }
                                dateFormat={"dd/MM/yyyy"}
                                onChange={(date) => {
                                  setFilterState((prev) => ({
                                    ...prev,
                                    date: date,
                                  }));
                                }}
                              />
                            </>
                          ) : filterType == "MODE" ? (
                            <>
                              <FormLabel>Select Branch</FormLabel>
                              <Select
                                onChange={(e) =>
                                  setModeFilterState((prev) => ({
                                    ...prev,
                                    branch: e.target.value,
                                  }))
                                }
                                value={modeFilterState.branch}
                              >
                                <option value={"ALL"}>All</option>
                                {branchList?.map((value: any, index) => (
                                  <option
                                    value={value.branch}
                                    key={value.branch}
                                  >
                                    {value?.branch}
                                  </option>
                                ))}
                              </Select>
                              <FormLabel>Select Sem</FormLabel>
                              <Select
                                onChange={(e) =>
                                  setModeFilterState((prev) => ({
                                    ...prev,
                                    sem: e.target.value,
                                  }))
                                }
                                value={modeFilterState.sem}
                              >
                                <option value={"ALL"}>All</option>
                                <option value={"NEW_ADMISSION"}>
                                  New Admission
                                </option>
                                <option value={"1"}>1</option>
                                <option value={"2"}>2</option>
                                <option value={"3"}>3</option>
                                <option value={"4"}>4</option>
                                <option value={"5"}>5</option>
                                <option value={"6"}>6</option>
                                <option value={"7"}>7</option>
                                <option value={"8"}>8</option>
                              </Select>
                              <FormLabel>Select Fee Type</FormLabel>
                              <Select
                                value={modeFilterState.type}
                                onChange={(e) =>
                                  setModeFilterState((prev) => ({
                                    ...prev,
                                    type: e.target.value,
                                  }))
                                }
                              >
                                <option value={"ALL"}>All</option>
                                <option value={"FEE"}>Fee</option>
                                <option value={"MISCELLANEOUS"}>
                                  Miscellaneous
                                </option>
                                <option value={"BUS_FEE"}>Bus Fee</option>
                                <option value={"EXCESS_FEE"}>Excess Fee</option>
                                <option value={"SECURITY_DEPOSIT"}>
                                  Security Deposit
                                </option>
                                <option value={"HOSTEL_FEE"}>Hostel Fee</option>
                              </Select>
                              <FormLabel>Select Mode</FormLabel>
                              <Select
                                value={modeFilterState.mode}
                                onChange={(e) =>
                                  setModeFilterState((prev) => ({
                                    ...prev,
                                    mode: e.target.value,
                                  }))
                                }
                              >
                                <option value={"ALL"}>All</option>
                                <option value={"CASH"}>Cash</option>
                                <option value={"ONLINE"}>Online</option>
                                <option value={"CHEQUE"}>Cheque</option>
                                <option value={"DD"}>DD</option>
                              </Select>
                              <FormLabel>From Date</FormLabel>
                              <ReactDatePicker
                                className="px-3 flex shadow-md justify-self-end w-[100%] ml-auto py-2 border rounded-md outline-brand"
                                selected={
                                  !modeFilterState.fromDate
                                    ? new Date()
                                    : new Date(modeFilterState.fromDate)
                                }
                                dateFormat={"dd/MM/yyyy"}
                                onChange={(date) => {
                                  setModeFilterState((prev) => ({
                                    ...prev,
                                    fromDate: date,
                                  }));
                                }}
                              />
                              <FormLabel>To Date</FormLabel>
                              <ReactDatePicker
                                className="px-3 flex shadow-md justify-self-end w-[100%] ml-auto py-2 border rounded-md outline-brand"
                                selected={
                                  !modeFilterState.toDate
                                    ? new Date()
                                    : new Date(modeFilterState.toDate)
                                }
                                dateFormat={"dd/MM/yyyy"}
                                onChange={(date) => {
                                  setModeFilterState((prev) => ({
                                    ...prev,
                                    toDate: date,
                                  }));
                                }}
                              />
                            </>
                          ) : null}
                        </FormControl>
                        <FormControl>
                          <Button
                            isLoading={isPushing}
                            onClick={() => {
                              switch (filterType) {
                                case "CHALLAN":
                                  onChallanFilter();
                                  onOpen();
                                  break;
                                case "CHALLAN_DATE":
                                  onDateFilter();
                                  onOpen();
                                  break;
                                case "PAID_DATE":
                                  onDateFilter();
                                  onOpen();
                                  break;
                                case "MODE":
                                  onModeFilter();
                                  break;
                                default:
                                  return;
                              }
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
              <Button
                as={Link}
                href={"/generate-reciept/without-usn"}
                size={"sm"}
                shadow={"md"}
                leftIcon={<AiOutlineFilePdf className={"text-xl"} />}
                colorScheme={"whatsapp"}
              >
                Generate Reciept
              </Button>
            </HStack>
          </HStack>
        </TabList>
        <TabPanels px={"0"} h={"full"}>
          <TabPanel
            px={"5"}
            pb={"20"}
            w={"full"}
            h={"83vh"}
            overflowY={"scroll"}
          >
            {children}
          </TabPanel>
          <TabPanel px={0} w={"100vw"}>
            {children}
          </TabPanel>
          <TabPanel px={0} py={"0"} w={"100vw"} h={"88vh"}>
            {children}
          </TabPanel>
          <TabPanel px={0} w={"100vw"} h={"88vh"} py={"0"}>
            {children}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}
