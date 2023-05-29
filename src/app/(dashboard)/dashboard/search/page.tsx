"use client";

export const dynamic = "force-dynamic";

import {
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
import {useEffect } from "react";
import {  fetchSearchByMode } from "@/store/fees.slice";
import { useAppDispatch } from "@/hooks";
import { useSearchParams } from "next/navigation";
import { useAppSelector } from "@/store";
import { AgGridReact } from "ag-grid-react";
import { SearchColumns } from "@/components/mock-data/fee-meta";
import { FcSearch } from "react-icons/fc";

export default function Home() {
  const dispatch = useAppDispatch();
  const params = useSearchParams();

  const branch = params.get("branch");
  const sem = params.get("sem");
  const toDate = params.get("toDate");
  const fromDate = params.get("fromDate");
  const mode = params.get("mode");
  const hash = params.get("hash");

  const feeFilter = useAppSelector(
    (state) => state.fees.search_by_mode.data
  ) as [];
  const Error = useAppSelector((state) => state.fees.search_by_mode.error) as
    | string
    | null;
  const isLoading = useAppSelector(
    (state) => state.fees.search_by_mode.pending
  ) as boolean;

  useEffect(() => {
    if (branch && mode && fromDate && toDate && sem && hash)
      dispatch(
        fetchSearchByMode({
          branch,
          mode,
          fromDate,
          toDate,
          sem,
        })
      );
  }, [branch, sem, toDate, mode, fromDate, hash]);

  if (isLoading)
    return (
      <Center h={"100%"} pb={"28"}>
        <VStack justifyContent={"center"}>
          <Spinner borderWidth={"2px"} size={"xl"} color="blue.700" />
          <Heading size={"md"} mt={"3"}>
            Searching...
          </Heading>
        </VStack>
      </Center>
    );

  return (
    <Stack h={"100%"} w={"100vw"} justifyContent={"start"}>
      <HStack
        py={"3"}
        px={"5"}
        w={"full"}
        bg={"white"}
        className="border-gray-300 border-b"
      >
        <Tag pl={"0"} size={"lg"} borderRadius={"full"} colorScheme="facebook">
          <Tag
            size={"lg"}
            borderRadius={"full"}
            colorScheme="facebook"
            variant={"solid"}
          >
            Branch
          </Tag>
          <TagLabel ml={"2"}>{branch}</TagLabel>
        </Tag>
        <Tag pl={"0"} size={"lg"} borderRadius={"full"} colorScheme="facebook">
          <Tag
            size={"lg"}
            borderRadius={"full"}
            colorScheme="facebook"
            variant={"solid"}
          >
            Sem
          </Tag>
          <TagLabel ml={"2"}>{sem}</TagLabel>
        </Tag>
        <Tag pl={"0"} size={"lg"} borderRadius={"full"} colorScheme="facebook">
          <Tag
            size={"lg"}
            borderRadius={"full"}
            colorScheme="facebook"
            variant={"solid"}
          >
            Mode
          </Tag>
          <TagLabel ml={"2"}>{mode}</TagLabel>
        </Tag>
        <Tag pl={"0"} size={"lg"} borderRadius={"full"} colorScheme="facebook">
          <Tag
            size={"lg"}
            borderRadius={"full"}
            colorScheme="facebook"
            variant={"solid"}
          >
            From Date
          </Tag>
          <TagLabel ml={"2"}>{fromDate}</TagLabel>
        </Tag>
        <Tag pl={"0"} size={"lg"} borderRadius={"full"} colorScheme="facebook">
          <Tag
            size={"lg"}
            borderRadius={"full"}
            colorScheme="facebook"
            variant={"solid"}
          >
            To Date
          </Tag>
          <TagLabel ml={"2"}>{toDate}</TagLabel>
        </Tag>
      </HStack>
      {feeFilter.length > 0 ? (
        <AgGridReact
          className="w-full h-full  pb-6 ag-theme-material"
          animateRows={true}
          rowData={feeFilter}
          columnDefs={SearchColumns as any}
          alwaysShowHorizontalScroll
          onRowEditingStarted={(e) => {}}
        />
      ) : feeFilter.length == 0 && Error ? (
        <Center h={"100%"} pb={"20"} flexDir={"column"}>
          <VStack>
            <FcSearch className="text-8xl" />
            <Heading size={"lg"}>{Error}</Heading>
          </VStack>
        </Center>
      ) : null}
    </Stack>
  );
}
