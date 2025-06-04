"use client";

import {
  Button,
  Center,
  EmptyState,
  HStack,
  Heading,
  Spinner,
  Tag,
  VStack,
} from "@chakra-ui/react";

import { useSearchParams } from "next/navigation";
import { useAppSelector } from "@/store";
import { AiOutlineFileExcel } from "react-icons/ai";
import { trpc } from "@/utils/trpc-cleint";
import { isEmpty } from "lodash";
import { useUser } from "@/utils/auth";
import Link from "next/link";
import { columns, columnsWithFee } from "./columns";
import { DataTable } from "@/components/data-table";
import React from "react";
import { LuSearchX } from "react-icons/lu";

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
    <React.Fragment>
      <HStack pb={"3"} w={"full"} borderBottomWidth={"thin"}>
        {mode !== "QUERY" ? (
          <React.Fragment>
            <Tag.Root pl={"0"}>
              <Tag.Root variant={"solid"}>
                <Tag.Label>Branch</Tag.Label>
              </Tag.Root>
              <Tag.Label ml={"2"}>{branch}</Tag.Label>
            </Tag.Root>

            <Tag.Root pl={"0"}>
              <Tag.Root variant={"solid"}>
                <Tag.Label>Year</Tag.Label>
              </Tag.Root>
              <Tag.Label ml={"2"}>{year}</Tag.Label>
            </Tag.Root>

            <Tag.Root pl={"0"}>
              <Tag.Root variant={"solid"}>
                <Tag.Label>Fee Type</Tag.Label>
              </Tag.Root>
              <Tag.Label ml={"2"}>{feeType}</Tag.Label>
            </Tag.Root>

            <Tag.Root pl={"0"}>
              <Tag.Root variant={"solid"}>
                <Tag.Label>Mode</Tag.Label>
              </Tag.Root>
              <Tag.Label ml={"2"}>{mode}</Tag.Label>
            </Tag.Root>

            <Tag.Root pl={"0"}>
              <Tag.Root variant={"solid"}>
                <Tag.Label>From Date</Tag.Label>
              </Tag.Root>
              <Tag.Label ml={"2"}>{fromDate}</Tag.Label>
            </Tag.Root>

            <Tag.Root pl={"0"}>
              <Tag.Root variant={"solid"}>
                <Tag.Label>To Date</Tag.Label>
              </Tag.Root>
              <Tag.Label ml={"2"}>{toDate}</Tag.Label>
            </Tag.Root>

            <Button ml={"auto"} asChild size={"xs"} variant={"surface"}>
              <Link
                target="_blank"
                href={
                  process.env.NEXT_PUBLIC_ADMIN_URL +
                  `feedownloadexcel.php?branch=${branch}&year=${year}&mode=${mode}&type=${feeType}&fromdate=${fromDate}&todate=${toDate}&college=${college}`
                }
              >
                <AiOutlineFileExcel className={"text-lg"} />
                Download Excel
              </Link>
            </Button>
          </React.Fragment>
        ) : (
          <>
            <Heading size={"sm"} color={"fg.muted"}>
              Search results for - `{query}`
            </Heading>
            <Tag.Root>
              <Tag.Label>
                Total {feeFilter && feeFilter.length} Records Found
              </Tag.Label>
            </Tag.Root>
          </>
        )}
      </HStack>

      {(feeFilter && feeFilter.length > 0) ||
      (feeFilterByMode && feeFilterByMode.length > 0) ? (
        <DataTable
          columns={mode !== "QUERY" ? columnsWithFee : columns}
          data={mode !== "QUERY" ? feeFilterByMode ?? [] : feeFilter ?? []}
        />
      ) : isDataEmpty ? (
        <Center py={"20"}>
          <EmptyState.Root>
            <EmptyState.Content>
              <EmptyState.Indicator>
                <LuSearchX />
              </EmptyState.Indicator>
              <VStack>
                <EmptyState.Title>No Data Found</EmptyState.Title>
                <EmptyState.Description>
                  Try diffrent keywords or remove applied filters
                </EmptyState.Description>
              </VStack>
            </EmptyState.Content>
          </EmptyState.Root>
        </Center>
      ) : null}
    </React.Fragment>
  );
}
