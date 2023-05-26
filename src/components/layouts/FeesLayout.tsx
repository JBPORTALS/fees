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
import React, { useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import {
  AiOutlineFilePdf,
  AiOutlineFilter,
  AiOutlineSearch,
  AiOutlineSend,
} from "react-icons/ai";
import GenerateRecieptModal from "../modals/GenerateRecieptModal";
import IModal from "../ui/utils/IModal";
import { toast } from "react-hot-toast";
import axios from "axios";
import moment from "moment";
import GenerateRecieptWithoutUSNModal from "../modals/GenerateRecieptModalWithoutUSN";
import "react-datepicker/dist/react-datepicker.css";
import { usePathname } from "next/navigation";
import { Link } from "@chakra-ui/next-js";

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
  const isUpdatingUSN = useAppSelector(
    (state) => state.fees.update_usn.pending
  ) as boolean;
  const [usn, setUSN] = useState("");
  const pathname = usePathname();

  useEffect(() => console.log(pathname), [pathname]);

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

  return (
    <div className="bg-primary relative overflow-hidden w-full  h-full flex flex-col">
      <Tabs
        tabIndex={
          pathname == "/dashboard"
            ? 0
            : pathname === "/dashboard/branchview"
            ? 1
            : pathname === "/dashboard/classview"
            ? 2
            : -1
        }
        colorScheme={"purple"}
        size={"sm"}
        variant={"solid-rounded"}
        h={"full"}
      >
        <TabList
          position={"sticky"}
          zIndex={100}
          bg={"whiteAlpha.100"}
          backdropBlur={"sm"}
          py={"4"}
          className="px-5 border-b border-gray-300 bg-[rgba(255,255,255,0.5)] backdrop-blur-sm"
        >
          <HStack justifyContent={"space-between"} w={"full"}>
            <HStack>
              <Tab
                as={Link}
                href={"/dashboard"}
                style={{ outlineColor: "#4945FF", outlineWidth: 1 }}
                _selected={{ bg: "#4945FF", color: "#ffff" }}
              >
                Overall
              </Tab>
              <Tab
                as={Link}
                href={"/dashboard/branchview"}
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
                as={Link}
                href={"/dashboard/classview"}
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
                <MenuList zIndex={"tooltip"}>
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
                              <FormLabel>From Date</FormLabel>
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
              <GenerateRecieptWithoutUSNModal>
                {({ onOpen }) => (
                  <Button
                    onClick={onOpen}
                    size={"sm"}
                    shadow={"md"}
                    variant={"outline"}
                    leftIcon={<AiOutlineFilePdf className={"text-xl"} />}
                    colorScheme={"whatsapp"}
                  >
                    Generate Reciept Without USN
                  </Button>
                )}
              </GenerateRecieptWithoutUSNModal>
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
        <TabPanels zIndex={"unset"} px={"0"}>
          <TabPanel
            px={"5"}
            pb={"20"}
            w={"full"}
            h={"100vh"}
            overflowY={"scroll"}
          >
            {children}
          </TabPanel>
          <TabPanel px={0}>{children}</TabPanel>
          <TabPanel px={0} w={"100vw"} h={"88vh"}>
            {children}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}
