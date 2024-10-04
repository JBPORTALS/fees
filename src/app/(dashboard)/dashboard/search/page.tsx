"use client";

export const dynamic = "force-dynamic";

import {
  Button,
  Center,
  HStack,
  Heading,
  Spinner,
  Stack,
  Tag,
  TagLabel,
  VStack,
} from "@chakra-ui/react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import { useSearchParams } from "next/navigation";
import { useAppSelector } from "@/store";
import { AgGridReact } from "ag-grid-react";
import {
  SearchColumns,
  feeSearchColumns,
} from "@/components/mock-data/fee-meta";
import { FcSearch } from "react-icons/fc";
import { AiOutlineFileExcel } from "react-icons/ai";
import { Link } from "@chakra-ui/next-js";
import { trpc } from "@/utils/trpc-cleint";
import { isEmpty } from "lodash";
import { useUser } from "@/utils/auth";

export default function Home() {
  const params = useSearchParams();
  const college = useUser()?.college;
  const acadYear = useAppSelector((state) => state.fees.acadYear);

  const branch = params.get("branch");
  const year = params.get("year");
  const toDate = params.get("toDate");
  const fromDate = params.get("fromDate");
  const mode = params.get("mode");
  const feeType = params.get("feeType");
  const query = params.get("query");

  const { data: feeFilter, isLoading } = trpc.searchData.useQuery(
    {
      acadYear,
      college: college ?? "",
      query: query as string,
    },
    {
      enabled: mode === "QUERY",
    }
  );
  const { data: feeFilterByMode, isLoading: isFilterByModeLoading } =
    trpc.searchDataByMode.useQuery(
      {
        acadYear,
        college: college ?? "",
        branch: branch as string,
        feeType: feeType as string,
        fromDate: fromDate as string,
        mode: mode as string,
        toDate: toDate as string,
        year: year as string,
      },
      {
        enabled:
          mode !== "QUERY" &&
          !!acadYear &&
          !!college &&
          !!branch &&
          !!feeType &&
          !!fromDate &&
          !!mode &&
          !!toDate &&
          !!year,
      }
    );

  const isDataFetching = mode !== "QUERY" ? isFilterByModeLoading : isLoading;
  const isDataEmpty =
    mode !== "QUERY" ? isEmpty(feeFilterByMode) : isEmpty(feeFilter);

  if (isDataFetching)
    return (
      <Center h={"100%"} pb={"28"}>
        <VStack justifyContent={"center"}>
          <Spinner borderWidth={"2px"} size={"xl"} color="blue.700" />
          <Heading size={"md"} mt={"3"}>
            Searching....
          </Heading>
        </VStack>
      </Center>
    );

  return (
    <Stack h={"100%"} w={"full"} justifyContent={"start"}>
      <HStack
        py={"3"}
        px={"5"}
        w={"full"}
        bg={"white"}
        className="border-gray-300 border-b"
      >
        <HStack w={"full"}>
          {mode !== "QUERY" ? (
            <>
              <Tag pl={"0"} borderRadius={"full"} colorScheme="facebook">
                <Tag
                  borderRadius={"full"}
                  colorScheme="facebook"
                  variant={"solid"}
                >
                  Branch
                </Tag>
                <TagLabel ml={"2"}>{branch}</TagLabel>
              </Tag>
              <Tag pl={"0"} borderRadius={"full"} colorScheme="facebook">
                <Tag
                  borderRadius={"full"}
                  colorScheme="facebook"
                  variant={"solid"}
                >
                  Year
                </Tag>
                <TagLabel ml={"2"}>{year}</TagLabel>
              </Tag>
              <Tag pl={"0"} borderRadius={"full"} colorScheme="facebook">
                <Tag
                  borderRadius={"full"}
                  colorScheme="facebook"
                  variant={"solid"}
                >
                  Fee Type
                </Tag>
                <TagLabel ml={"2"}>{feeType}</TagLabel>
              </Tag>
              <Tag pl={"0"} borderRadius={"full"} colorScheme="facebook">
                <Tag
                  borderRadius={"full"}
                  colorScheme="facebook"
                  variant={"solid"}
                >
                  Mode
                </Tag>
                <TagLabel ml={"2"}>{mode}</TagLabel>
              </Tag>
              <Tag pl={"0"} borderRadius={"full"} colorScheme="facebook">
                <Tag
                  borderRadius={"full"}
                  colorScheme="facebook"
                  variant={"solid"}
                >
                  From Date
                </Tag>
                <TagLabel ml={"2"}>{fromDate}</TagLabel>
              </Tag>
              <Tag pl={"0"} borderRadius={"full"} colorScheme="facebook">
                <Tag
                  borderRadius={"full"}
                  colorScheme="facebook"
                  variant={"solid"}
                >
                  To Date
                </Tag>
                <TagLabel ml={"2"}>{toDate}</TagLabel>
              </Tag>
              <Button
                ml={"2"}
                as={Link}
                target="_blank"
                href={
                  process.env.NEXT_PUBLIC_ADMIN_URL +
                  `feedownloadexcel.php?branch=${branch}&year=${year}&mode=${mode}&type=${feeType}&fromdate=${fromDate}&todate=${toDate}&college=${college}`
                }
                size={"sm"}
                colorScheme="facebook"
                leftIcon={<AiOutlineFileExcel className={"text-lg"} />}
              >
                Download Excel
              </Button>
            </>
          ) : (
            <>
              <Heading size={"sm"} color={"gray.600"}>
                Search results for - `{query}`
              </Heading>
              <Tag>Total {feeFilter && feeFilter.length} records found</Tag>
            </>
          )}
        </HStack>
      </HStack>
      {(feeFilter && feeFilter.length > 0) ||
      (feeFilterByMode && feeFilterByMode.length > 0) ? (
        <AgGridReact
          className="w-full h-full  pb-6 ag-theme-material"
          animateRows={true}
          rowData={mode !== "QUERY" ? feeFilterByMode : feeFilter}
          columnDefs={
            mode !== "QUERY"
              ? (SearchColumns as any)
              : (feeSearchColumns as any)
          }
          alwaysShowHorizontalScroll
          onRowEditingStarted={(e) => {}}
        />
      ) : isDataEmpty ? (
        <Center h={"100%"} pb={"20"} flexDir={"column"}>
          <VStack>
            <FcSearch className="text-8xl" />
            <Heading size={"lg"}>No Data Found</Heading>
          </VStack>
        </Center>
      ) : null}
    </Stack>
  );
}
