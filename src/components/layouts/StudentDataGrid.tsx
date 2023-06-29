"use client";

import { useAppSelector } from "@/store";
import { AgGridReact } from "ag-grid-react";
import { Center, Heading, VStack } from "@chakra-ui/react";
import { StudentColumnDefs } from "../mock-data/students-meta";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";

function StudentDataGrid() {
  const FeeDetails = useAppSelector((state) => state.fees.all_fee.data) as any;
  const Error = useAppSelector((state) => state.fees.all_fee.error) as
    | null
    | string;

  return (
    <VStack h={"full"} w={"full"}>
      {FeeDetails.length > 0 ? (
        <AgGridReact
          className="w-full h-full ag-theme-material"
          animateRows={true}
          rowData={FeeDetails}
          columnDefs={StudentColumnDefs as any}
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

export default StudentDataGrid;
