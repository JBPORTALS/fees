"use client";

import { useAppSelector } from "@/store";
import { AgGridReact } from "ag-grid-react";
import { columns, columnsForNonUpdate } from "../mock-data/fee-meta";
import { Center, Heading, VStack } from "@chakra-ui/react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";

function ClassDataGrid() {
  const FeeDetails = useAppSelector((state) => state.fees.all_fee.data) as any;
  const Error = useAppSelector((state) => state.fees.all_fee.error) as
    | null
    | string;
  const user = useAppSelector(state => state.fees.user);

  return (
    <VStack h={"78vh"} w={"full"}>
      {FeeDetails.length > 0 ? (
        <AgGridReact
          className="w-full h-full  pb-6 ag-theme-material"
          animateRows={true}
          rowData={FeeDetails}
          columnDefs={
            user?.can_update_total ? (columns as any) : (columnsForNonUpdate as any)
          }
          alwaysShowHorizontalScroll
          onRowEditingStarted={(e) => { }}
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
