"use client";
import {
  Box,
  Button,
  Center,
  Heading,
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  VStack,
} from "@chakra-ui/react";
import React, { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  AiOutlineArrowRight,
  AiOutlineCheckCircle,
  AiOutlineClockCircle,
  AiOutlineCloudDownload,
} from "react-icons/ai";
import ISelect from "../ui/utils/ISelect";
import { InfoCard } from "../ui/utils/InfoCard";
import { UnAprrovedColumns } from "../mock-data/admission-meta";
import { AgGridReact } from "ag-grid-react";
import { useAppDispatch } from "@/hooks";
import { useAppSelector } from "@/store";
import {
  fetchBranchList,
  fetchUnApprovedAdmissions,
} from "@/store/admissions.slice";
import { useParams } from "next/navigation";
import AddCouncelAddmissionModel from "../modals/AddCouncelAdmissionModal";
import { SC } from "@/utils/supabase";
import { useSupabase } from "@/app/supabase-provider";

interface AttendanceLayoutProps {
  children: React.ReactNode;
  showDownloadFile?: boolean;
}

export default function AdmissionLayout({
  children,
  showDownloadFile,
}: AttendanceLayoutProps) {
  const router = useParams();

  const { college, branch } = router;

  const [ubranch, setBranch] = useState<string | undefined>("");
  const [ucollege, setCollege] = useState<string | undefined>("");
  const [branchList, setBranchList] = useState<[]>([]);

  const data = useAppSelector(
    (state) => state.admissions.unapproved_matrix.data
  ) as [];
  const Error = useAppSelector(
    (state) => state.admissions.unapproved_matrix.error
  ) as [];
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (ucollege !== undefined)
      dispatch(fetchBranchList({ college: ucollege })).then((value: any) => {
        setBranchList(value.payload);
      });
    setBranch("");
  }, [ucollege, dispatch]);

  useEffect(() => {
    ucollege &&
      ubranch &&
      dispatch(
        fetchUnApprovedAdmissions({
          college: ucollege,
          branch: ubranch,
        })
      );
  }, [ucollege, ubranch, dispatch]);

  const {user} = useSupabase();

  return (
    <div className="bg-primary overflow-hidden w-full  h-full flex flex-col">
      <HStack
        w={"full"}
        px={"5"}
        justifyContent={"space-between"}
        h={"14"}
        bg={"white"}
      >
        <Heading size={"md"} color={"blue"}>
          Admissions Matrix
        </Heading>
        <HStack>
          <Heading size={"sm"}>{user?.username}</Heading>
          <Tag colorScheme="gray" variant={"outline"}>{user?.email}</Tag>
          <Button
            variant={"ghost"}
            colorScheme="blue"
            onClick={async () => await SC().auth.signOut()}
          >
            Sign Out
          </Button>
        </HStack>
      </HStack>
      <Tabs
        colorScheme={"purple"}
        size={"sm"}
        variant={"enclosed"}
        h={"92vh"}
        w={"full"}
        px={"0"}
      >
        <TabList className="px-5">
          <HStack justifyContent={"space-between"} w={"full"} py={"2"}>
            <HStack>
              <Tab
                as={Button}
                size={"sm"}
                style={{ outlineWidth: 1 }}
                _selected={{ bg: "#3d8d13", color: "#ffff" }}
                leftIcon={<AiOutlineCheckCircle className="text-lg" />}
              >
                Approved
              </Tab>
              <Tab
                as={Button}
                style={{
                  outlineWidth: 1,
                  marginLeft: "15px",
                }}
                size={"sm"}
                _selected={{ bg: "#f43717", color: "#ffff" }}
                leftIcon={<AiOutlineClockCircle className="text-lg" />}
              >
                Un-Approved
              </Tab>
            </HStack>
            <HStack>
              <AddCouncelAddmissionModel>
                {({ onOpen }) => (
                  <Button onClick={onOpen} size={"sm"} colorScheme="blue">
                    Add Enquiry
                  </Button>
                )}
              </AddCouncelAddmissionModel>
            </HStack>
          </HStack>
        </TabList>
        <TabPanels px={"0"} h={"full"}>
          <TabPanel px={"0"} h={"100vh"}>
            <HStack
              px={"5"}
              py={"3"}
              borderBottom={"1px"}
              borderTop={"1px"}
              borderColor={"gray.200"}
            >
              <HStack w={"full"}>
                <Link href={"/dashboard"}>
                  <Box _hover={{ textDecoration: "underline" }}>Overall</Box>
                </Link>
                {college && (
                  <>
                    <AiOutlineArrowRight />
                    <Link href={"/dashboard/" + college}>
                      <Box _hover={{ textDecoration: "underline" }}>
                        {college}
                      </Box>
                    </Link>
                  </>
                )}
                {college && branch && (
                  <>
                    <AiOutlineArrowRight />
                    <Box _hover={{ textDecoration: "underline" }}>{branch}</Box>
                  </>
                )}
              </HStack>
              <HStack>
                {showDownloadFile && (
                  <>
                    <Button
                      as={Link}
                      target={"_blank"}
                      download
                      href={
                        process.env.NEXT_PUBLIC_ADMISSIONS_URL +
                        `dowloadclassexcel.php?college=${college}&branch=${branch}`
                      }
                      leftIcon={<AiOutlineCloudDownload className="text-lg" />}
                      colorScheme={"green"}
                      variant={"outline"}
                      size={"sm"}
                    >
                      Download Excel
                    </Button>
                    <Button
                      as={Link}
                      target={"_blank"}
                      download
                      href={
                        process.env.NEXT_PUBLIC_ADMISSIONS_URL +
                        `downloadclasspdf.php?college=${college}&branch=${branch}`
                      }
                      leftIcon={<AiOutlineCloudDownload className="text-lg" />}
                      colorScheme={"orange"}
                      variant={"outline"}
                      size={"sm"}
                    >
                      Download PDF
                    </Button>
                  </>
                )}
              </HStack>
            </HStack>
            <VStack h={"100vh"} w={"full"}>
              {children}
            </VStack>
          </TabPanel>
          <TabPanel px={"0"} h={"full"}>
            <div className="w-full flex border-b py-2 space-x-3 px-5">
              <ISelect
                placeHolder="Select College"
                value={ucollege}
                onChange={(value) => setCollege(value)}
                options={[
                  { value: "KSIT", option: "KSIT" },
                  { value: "KSPT", option: "KSPT" },
                  { value: "KSPU", option: "KSPU" },
                  { value: "KSSA", option: "KSSA" },
                  { value: "KSSEM", option: "KSSEM" },
                ]}
              />
              {ucollege ? (
                <ISelect
                  placeHolder="Select Branch"
                  value={ubranch}
                  onChange={(value) => setBranch(value)}
                  options={branchList}
                />
              ) : null}
            </div>
            <VStack className="w-full h-full" spacing={0}>
              {!ucollege ? (
                <InfoCard message="Select College" />
              ) : ucollege && !ubranch ? (
                <InfoCard message="Select Branch" />
              ) : null}
              <VStack
                spacing={0}
                className={
                  "justify-start items-start flex w-full h-full overflow-scroll"
                }
              >
                {/* displaying admin childrens */}
                {ubranch && ucollege && data.length > 0 ? (
                  <AgGridReact
                    alwaysShowHorizontalScroll
                    animateRows={true}
                    className="w-full h-full  pb-6 ag-theme-material"
                    rowData={data as any}
                    columnDefs={UnAprrovedColumns as any}
                  />
                ) : ubranch && ucollege && data.length == 0 ? (
                  <Center h={"80%"}>
                    <Heading size={"lg"}>{Error}</Heading>
                  </Center>
                ) : null}
              </VStack>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}
