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
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  Skeleton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import {
  AiOutlineArrowRight,
  AiOutlineDatabase,
  AiOutlineDownload,
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
import { shallowEqual } from "react-redux";
import { FaBullseye, FaChevronDown } from "react-icons/fa";
import { MdBarChart, MdOutlineAutoGraph } from "react-icons/md";
import { SiGoogleclassroom } from "react-icons/si";
import Link from "next/link";

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
  const yearList = useAppSelector((state) => state.fees.year_list);

  const [state, setState] = useState({
    branch: "",
    year: "",
    status: "",
  });

  const [modeFilterState, setModeFilterState] = useState<{
    branch: string;
    year: string;
    mode: string;
    fromDate: Date | null;
    toDate: Date | null;
    type: string;
  }>({
    branch: "ALL",
    year: "ALL",
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
        amount_paid: string;
        type: string;
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
  const user = useAppSelector((state) => state.fees.user);
  const acadYear = useAppSelector((state) => state.fees.acadYear);

  // const fetchBranchListCb = useCallback(() => {
  //   dispatch(fetchBranchList({ college: user?.college! }));
  // }, []);

  // useEffect(() => {
  //   fetchBranchListCb();
  // }, [isOpen]);

  const onDateFilter = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("date", moment(filterState.date).format("yyyy-MM-DD"));
      formData.append("college", user?.college!);
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
      formData.append("college", user?.college!);
      formData.append("acadyear", acadYear);
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
      `/dashboard/search?branch=${modeFilterState.branch}&year=${
        modeFilterState.year
      }&mode=${modeFilterState.mode}&feeType=${
        modeFilterState.type
      }&fromDate=${moment(modeFilterState.fromDate).format(
        "DD-MM-yyyy"
      )}&toDate=${moment(modeFilterState.toDate).format(
        "DD-MM-yyyy"
      )}&hash=${new Date().getTime()}`
    );
    setIsPushing(false);
  };

  return (
    <div className="bg-primary relative overflow-hidden w-full h-full flex flex-col">
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
          w={"full"}
          className="px-5 border-b border-gray-300 bg-[rgba(255,255,255,0.5)] backdrop-blur-sm flex justify-between"
        >
          <HStack justifyContent={"space-between"} w={"full"}>
            <HStack>
              <Tab
                gap={2}
                as={Link}
                href={"/dashboard"}
                _hover={{ textDecoration: "none" }}
              >
                <FaBullseye />
                <Text>Overall</Text>
              </Tab>
              <Tab
                as={Link}
                gap={2}
                href={"/dashboard/branchview"}
                _hover={{ textDecoration: "none" }}
              >
                <MdBarChart />
                <Text>Analytics</Text>
              </Tab>
              <Tab
                as={Link}
                gap={2}
                href={"/dashboard/classview"}
                _hover={{ textDecoration: "none" }}
              >
                <SiGoogleclassroom />
                <Text>Class Data</Text>
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
                modalBodyProps={{
                  p: "0",
                }}
              >
                <VStack w={"full"}>
                  {isloading
                    ? new Array(6).fill(0).map((_value, key) => {
                        return (
                          <Skeleton key={key} w={"full"} h={"16"}></Skeleton>
                        );
                      })
                    : filteredData?.map((paymentData, index) => {
                        const conditionalAsProp = paymentData.usn
                          ? {
                              href: `/generate-reciept/with-usn/${paymentData.type}?challan_id=${paymentData.challan_id}`,
                              _hover: { bg: "rgba(0,0,0,0.03)" },
                            }
                          : {};
                        return (
                          <>
                            <HStack
                              role="group"
                              as={paymentData.usn ? Link : "div"}
                              key={paymentData.challan_id + index}
                              w={"full"}
                              className={"border-b group border-b-lightgray"}
                              px={"5"}
                              py={"2"}
                              gap={"5"}
                              {...conditionalAsProp}
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
                                    ₹{paymentData.amount_paid}
                                  </h1>
                                  <span className="text-md font-medium">
                                    <i>{paymentData.method}</i>
                                  </span>
                                </Box>
                              </VStack>
                              {paymentData.usn && (
                                <Box
                                  _groupHover={{
                                    transform: "translateX(10px)",
                                    color: "blue",
                                  }}
                                  transition={"transform 0.3s ease"}
                                >
                                  <AiOutlineArrowRight className="text-2xl" />
                                </Box>
                              )}
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
                                      college: user?.college!,
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
              <Menu placement="bottom-end">
                <MenuButton
                  as={Button}
                  leftIcon={<AiOutlineDatabase />}
                  size={"sm"}
                  variant={"ghost"}
                  rightIcon={<FaChevronDown />}
                  position={"sticky"}
                  zIndex={"popover"}
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
                        {branchList.map((option: any) => (
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
                        href={`${process.env.NEXT_PUBLIC_ADMIN_URL}downloadclassexcel.php?college=${user?.college}&branch=${state.branch}&year=${state.year}&status=${state.status}&acadYear=${acadYear}`}
                      >
                        Download Excel
                      </Button>
                    </FormControl>
                  </VStack>
                </MenuList>
              </Menu>
              <Menu size={"lg"} closeOnSelect placement="bottom-end">
                <MenuButton
                  as={Button}
                  size={"sm"}
                  leftIcon={<AiOutlineFilter className={"text-xl"} />}
                  variant={"ghost"}
                  rightIcon={<FaChevronDown />}
                  position={"sticky"}
                  zIndex={"popover"}
                >
                  Filter
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
                              <FormLabel>Select Year</FormLabel>
                              <Select
                                onChange={(e) =>
                                  setModeFilterState((prev) => ({
                                    ...prev,
                                    year: e.target.value,
                                  }))
                                }
                                value={modeFilterState.year}
                              >
                                <option value={"ALL"}>All</option>
                                {(user?.college == "KSIT"
                                  ? [
                                      { year: 1 },
                                      { year: 2 },
                                      { year: 3 },
                                      { year: 4 },
                                    ]
                                  : yearList
                                ).map((option: any) => (
                                  <option
                                    value={option?.year}
                                    key={option?.year}
                                  >
                                    {option?.year}
                                  </option>
                                ))}
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
                          <MenuItem p={"0"} _hover={{ bg: "transparent" }}>
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
                          </MenuItem>
                        </FormControl>
                      </>
                    )}
                  </VStack>
                </MenuList>
              </Menu>
            </HStack>
          </HStack>
        </TabList>
        <TabPanels px={"0"} w={"full"} h={"full"}>
          <TabPanel
            px={"5"}
            pb={"20"}
            w={"full"}
            h={"83vh"}
            overflowY={"scroll"}
          >
            {children}
          </TabPanel>
          <TabPanel
            py={"0"}
            px={"0"}
            pb={"20"}
            w={"full"}
            h={"83vh"}
            overflowY={"scroll"}
          >
            {children}
          </TabPanel>
          <TabPanel px={0} py={"0"} w={"full"} h={"88vh"}>
            {children}
          </TabPanel>
          <TabPanel px={0} w={"full"} h={"88vh"} py={"0"}>
            {children}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}
