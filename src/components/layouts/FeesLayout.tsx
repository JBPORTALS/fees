import { useAppDispatch } from "@/hooks";
import { useAppSelector } from "@/store";
import { updateUSN } from "@/store/fees.slice";
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
  Collapsible,
  Field,
  Heading,
  HStack,
  Input,
  Menu,
  NativeSelect,
  NumberInput,
  Separator,
  Skeleton,
  Tabs,
  Tag,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { MenuContent, MenuRoot, MenuTrigger } from "../ui/menu";
import React, { useState } from "react";
import { AiOutlineArrowRight, AiOutlineSearch } from "react-icons/ai";
import IModal from "../ui/utils/IModal";
import axios from "axios";
import moment from "moment";

import { usePathname, useRouter } from "next/navigation";
import { shallowEqual } from "react-redux";
import Link from "next/link";
import { useUser } from "@/utils/auth";
import { toaster } from "../ui/toaster";
import {
  LuBarChart,
  LuChevronDown,
  LuDatabase,
  LuLayoutDashboard,
  LuListFilter,
  LuListOrdered,
} from "react-icons/lu";

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

interface SearchResultItemProps {
  paymentData: {
    challan_id: string;
    usn: string;
    name: string;
    date: string;
    method: string;
    amount_paid1: string;
    type: string;
  };
  onRefresh: () => void;
  isUpdating: boolean;
}

export const SearchResultItem = ({
  paymentData,
  isUpdating,
  onRefresh,
}: SearchResultItemProps) => {
  const [usnInput, setUsnInput] = useState(paymentData.usn ?? "");
  const [edit, setEdit] = useState(false);
  const dispatch = useAppDispatch();
  const user = useUser();

  const targetHref = paymentData.usn
    ? `/generate-reciept/with-usn/${paymentData.type}?challan_id=${paymentData.challan_id}`
    : `/generate-reciept/without-usn/${paymentData.type}?challan_id=${paymentData.challan_id}`;

  const handleUpdate = () => {
    dispatch(
      updateUSN({
        challan_no: paymentData.challan_id,
        usn: usnInput,
        college: user?.college!,
      })
    ).then(() => {
      onRefresh();
    });
  };

  return (
    <VStack
      w="full"
      px={5}
      py={3}
      gap={5}
      rounded="md"
      align="stretch"
      _hover={{ bg: "gray.50" }}
    >
      <HStack w={"full"}>
        {/* Left Section (Clickable for redirection) */}
        <Link href={targetHref} style={{ flex: 1 }}>
          <VStack align="start" gap={2}>
            <Heading size="sm" textTransform="capitalize">
              {paymentData.name.toLowerCase()}
              {paymentData.usn && ` (${paymentData.usn})`}
            </Heading>
            <HStack gap={2}>
              <Tag.Root
                size="md"
                variant="outline"
                colorScheme="teal"
                fontWeight="bold"
              >
                <Tag.Label>CH No. {paymentData.challan_id}</Tag.Label>
              </Tag.Root>
              <Text fontSize="sm" color="gray.500">
                {paymentData.date}
              </Text>
            </HStack>
          </VStack>
        </Link>

        {/* Right Section (Input only if no USN) */}
        <VStack align="end" gap={2}>
          <Box textAlign="right">
            <Text fontWeight="bold" fontSize="xl" color="green.600">
              ₹{paymentData.amount_paid1}
            </Text>
            <Text fontSize="md" fontWeight="medium">
              <i>{paymentData.method}</i>
            </Text>
          </Box>
        </VStack>
      </HStack>
      {/* 
      <Collapsible.Root>
        {!paymentData.usn && (
          <>
            <Separator mb={"4"} />
            <Collapsible.Trigger asChild>
              <Button h={"6"} px={"0.5"} size={"xs"} variant={"ghost"}>
                Edit USN
              </Button>
            </Collapsible.Trigger>
          </>
        )}
        <Collapsible.Content>
          <HStack py={"2.5"} px={"0.5"}>
            <Input
              maxW={"64"}
              placeholder="Enter USN here ..."
              value={usnInput}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setUsnInput(e.target.value)}
            />
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleUpdate();
              }}
              loading={isUpdating}
              disabled={!usnInput}
            >
              Update
            </Button>
          </HStack>
        </Collapsible.Content>
      </Collapsible.Root> */}
    </VStack>
  );
};

export default function FeesLayout({ children }: AttendanceLayoutProps) {
  const dispatch = useAppDispatch();
  const { open, onClose, onOpen } = useDisclosure();
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
    fromDate: string | null;
    toDate: string | null;
    type: string;
  }>({
    branch: "ALL",
    year: "ALL",
    mode: "ALL",
    fromDate: new Date().toDateString(),
    toDate: new Date().toDateString(),
    type: "ALL",
  });

  const branchList = useAppSelector(
    (state) => state.fees.branch_list.data,
    shallowEqual
  ) as [];

  const [filterType, setFilterType] = useState<string>("");
  const [filterState, setFilterState] = useState<{
    challan_no: string;
    date: string | null;
  }>({
    date: new Date().toDateString(),
    challan_no: "",
  });
  const [filteredData, setFilteredData] = useState<
    | {
        challan_id: string;
        usn: string;
        name: string;
        date: string;
        method: string;
        amount_paid1: string;
        type: string;
      }[]
    | null
  >(null);
  const [isloading, setIsLoading] = useState(true);
  const [isPushing, setIsPushing] = useState(false);
  const isUpdatingUSN = useAppSelector(
    (state) => state.fees.update_usn.pending
  ) as boolean;
  const pathname = usePathname();
  const router = useRouter();
  const user = useUser();
  const acadYear = useAppSelector((state) => state.fees.acadYear);

  const onDateFilter = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("date", moment(filterState.date).format("yyyy-MM-DD"));
      formData.append("college", user?.college!);
      formData.append("acadYear", acadYear);
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
      toaster.error({ title: e.response?.data?.msg });
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
      toaster.error({ title: e.response?.data?.msg });
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
    <React.Fragment>
      <Tabs.Root
        defaultValue={pathname.split("/").pop()}
        size={"lg"}
        variant={"enclosed"}
        h={"full"}
        position={"sticky"}
        inset={"0"}
        top={"20"}
        zIndex={"banner"}
      >
        <Tabs.List
          backdropFilter={"blur(5px)"}
          bg={"AppWorkspace/60"}
          shadow={"xs"}
          w={"full"}
          borderWidth={"thin"}
          borderColor={"border.muted"}
        >
          <HStack justifyContent={"space-between"} w={"full"}>
            <HStack>
              <Tabs.Trigger
                value="dashboard"
                gap={2}
                asChild
                _hover={{ textDecoration: "none" }}
              >
                <Link href={"/dashboard"}>
                  <LuLayoutDashboard />
                  <Text>Overall</Text>
                </Link>
              </Tabs.Trigger>
              <Tabs.Trigger
                value="branchview"
                asChild
                gap={2}
                _hover={{ textDecoration: "none" }}
              >
                <Link href={"/dashboard/branchview"}>
                  <LuBarChart />
                  <Text>Analytics</Text>
                </Link>
              </Tabs.Trigger>
              <Tabs.Trigger
                value="classview"
                asChild
                gap={2}
                _hover={{ textDecoration: "none" }}
              >
                <Link href={"/dashboard/classview"}>
                  <LuListOrdered />
                  <Text>Class Data</Text>
                </Link>
              </Tabs.Trigger>
            </HStack>

            <HStack zIndex={"sticky"}>
              {/** Update & Challans for particular date */}
              <IModal
                hideBtn
                size={"lg"}
                open={open}
                onClose={onClose}
                heading={"Search Result"}
              >
                <VStack w="full" gap={4}>
                  {isloading
                    ? new Array(6)
                        .fill(0)
                        .map((_value, key) => (
                          <Skeleton key={key} w="full" h="16" />
                        ))
                    : filteredData?.map((paymentData, index) => {
                        return (
                          <SearchResultItem
                            key={index}
                            isUpdating={isUpdatingUSN}
                            onRefresh={() => {}}
                            paymentData={paymentData}
                          />
                        );
                      })}
                </VStack>
              </IModal>

              {/** Menu #1 */}
              <MenuRoot positioning={{ placement: "bottom-end" }}>
                <MenuTrigger asChild>
                  <Button size={"sm"} colorPalette={"gray"} variant={"ghost"}>
                    <LuDatabase />
                    Download Class Data <LuChevronDown />
                  </Button>
                </MenuTrigger>
                <MenuContent w={"250px"}>
                  <VStack p={"2"}>
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
                          <option value={""}>Select Branch</option>
                          {branchList.map((option: any) => (
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
                          <option value={""}>Select Year</option>
                          {(user?.college == "KSIT"
                            ? [
                                { year: 1 },
                                { year: 2 },
                                { year: 3 },
                                { year: 4 },
                              ]
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
                          <option value={""}>Select Status</option>
                          <option value={"ALL"}>All</option>
                          <option value={"NOT PAID"}>Not Paid</option>
                          <option value={"PARTIALLY PAID"}>
                            Partially Paid
                          </option>
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

              {/** Menu #2 */}
              <MenuRoot closeOnSelect positioning={{ placement: "bottom-end" }}>
                <MenuTrigger asChild>
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    position={"sticky"}
                    zIndex={"popover"}
                    colorPalette={"gray"}
                  >
                    <LuListFilter className={"text-xl"} />
                    Filter
                    <LuChevronDown />
                  </Button>
                </MenuTrigger>

                <MenuContent w={"250px"}>
                  <VStack p={"2"}>
                    <Field.Root>
                      <NativeSelect.Root>
                        <NativeSelect.Field
                          value={filterType}
                          onChange={(e) => setFilterType(e.target.value)}
                        >
                          <option value={""}>Select Filter</option>
                          <option value={"CHALLAN_DATE"}>
                            By Challan Date
                          </option>
                          <option value={"PAID_DATE"}>By Paid Date</option>
                          <option value={"CHALLAN"}>By Challan No.</option>
                          <option value={"MODE"}>By Mode</option>
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                      </NativeSelect.Root>
                    </Field.Root>
                    {filterType && (
                      <>
                        <Field.Root>
                          {filterType == "CHALLAN" ? (
                            <>
                              <Field.Label>Challan No.</Field.Label>
                              <NumberInput.Root
                                w={"full"}
                                value={filterState.challan_no}
                                min={0}
                                max={15000000}
                                onValueChange={({ value }) => {
                                  setFilterState((prev) => ({
                                    ...prev,
                                    challan_no: value,
                                  }));
                                }}
                              >
                                <NumberInput.Control />
                                <NumberInput.Input />
                              </NumberInput.Root>
                            </>
                          ) : filterType == "PAID_DATE" ||
                            filterType == "CHALLAN_DATE" ? (
                            <>
                              <Field.Label>Date</Field.Label>
                              <Input
                                type="date"
                                value={filterState.date ?? ""}
                                onChange={(e) => {
                                  setFilterState((prev) => ({
                                    ...prev,
                                    date: e.target.value,
                                  }));
                                }}
                              />
                            </>
                          ) : filterType == "MODE" ? (
                            <>
                              <Field.Label>Select Branch</Field.Label>
                              <NativeSelect.Root>
                                <NativeSelect.Field
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
                                </NativeSelect.Field>
                                <NativeSelect.Indicator />
                              </NativeSelect.Root>
                              <Field.Label>Select Year</Field.Label>
                              <NativeSelect.Root>
                                <NativeSelect.Field
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
                                </NativeSelect.Field>
                                <NativeSelect.Indicator />
                              </NativeSelect.Root>
                              <Field.Label>Select Fee Type</Field.Label>
                              <NativeSelect.Root>
                                <NativeSelect.Field
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
                                  <option value={"EXCESS_FEE"}>
                                    Excess Fee
                                  </option>
                                  <option value={"SECURITY_DEPOSIT"}>
                                    Security Deposit
                                  </option>
                                  <option value={"HOSTEL_FEE"}>
                                    Hostel Fee
                                  </option>
                                </NativeSelect.Field>
                                <NativeSelect.Indicator />
                              </NativeSelect.Root>
                              <Field.Label>Select Mode</Field.Label>
                              <NativeSelect.Root>
                                <NativeSelect.Field
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
                                </NativeSelect.Field>
                              </NativeSelect.Root>
                              <Field.Label>From Date</Field.Label>
                              <Input
                                type="date"
                                value={modeFilterState.fromDate ?? ""}
                                onChange={(e) => {
                                  setModeFilterState((prev) => ({
                                    ...prev,
                                    fromDate: e.target.value,
                                  }));
                                }}
                              />
                              <Field.Label>To Date</Field.Label>
                              <Input
                                type="date"
                                value={modeFilterState.toDate ?? ""}
                                onChange={(e) => {
                                  setModeFilterState((prev) => ({
                                    ...prev,
                                    toDate: e.target.value,
                                  }));
                                }}
                              />
                            </>
                          ) : null}
                        </Field.Root>
                        <Field.Root>
                          <Menu.Item
                            value="mode"
                            p={"0"}
                            _hover={{ bg: "transparent" }}
                          >
                            <Button
                              loading={isPushing}
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
                              colorPalette={"blue"}
                              w={"full"}
                            >
                              Search <AiOutlineSearch className={"text-lg"} />
                            </Button>
                          </Menu.Item>
                        </Field.Root>
                      </>
                    )}
                  </VStack>
                </MenuContent>
              </MenuRoot>

              {/* <Button variant={"ghost"} size={"sm"}>
                Advance Filters
              </Button> */}
            </HStack>
          </HStack>
        </Tabs.List>
      </Tabs.Root>

      {children}
    </React.Fragment>
  );
}
