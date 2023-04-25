"use client";

import { useAppSelector } from "@/store";
import { AgGridReact } from "ag-grid-react";
import { columns } from "../mock-data/fee-meta";
import { Center, Heading, VStack } from "@chakra-ui/react";

function ClassDataGrid() {
  const FeeDetails = useAppSelector(state=>state.fees.all_fee.data) as any;
  const Error = useAppSelector(
    (state) => state.fees.all_fee.error
  ) as null | string;

  return (
    <VStack h={"78vh"} w={"100vw"}>
      {FeeDetails.length > 0 ? (
        <AgGridReact
          className="w-full h-full  pb-6 ag-theme-material"
          animateRows={true}
          rowData={FeeDetails}
          columnDefs={columns as any}
          alwaysShowHorizontalScroll
          onRowEditingStarted={(e) => {}}
        />
      ) : FeeDetails.length == 0 && Error ? (
        <Center h={"80%"}>
          <Heading size={"lg"}>{Error}</Heading>
        </Center>
      ) : null}
    </VStack>
  );
}

export default ClassDataGrid;
