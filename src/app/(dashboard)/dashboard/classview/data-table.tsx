"use client";

import { useAppSelector } from "@/store";
import { Center, Heading } from "@chakra-ui/react";

import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import React from "react";

export function ClassDataTable() {
  const FeeDetails = useAppSelector((state) => state.fees.all_fee.data) as any;
  const Error = useAppSelector((state) => state.fees.all_fee.error) as
    | null
    | string;

  return (
    <React.Fragment>
      {FeeDetails.length > 0 ? (
        <DataTable columns={columns} data={FeeDetails} />
      ) : FeeDetails.length == 0 && Error ? (
        <Center>
          <Heading size={"lg"}>{Error}</Heading>
        </Center>
      ) : null}
    </React.Fragment>
  );
}
