"use client";

import { useAppSelector } from "@/store";
import { AgGridReact } from "ag-grid-react";
import { Center, Heading, VStack } from "@chakra-ui/react";
import { Student, StudentColumnDefs } from "../mock-data/students-meta";

function StudentDataGrid() {
  const FeeDetails = useAppSelector((state) => state.fees.all_fee.data) as any;
  const Error = useAppSelector((state) => state.fees.all_fee.error) as
    | null
    | string;

  return (
    <VStack h={"full"} w={"full"}>
      {FeeDetails.length > 0 ? (
        <AgGridReact<Student>
          className="w-full h-full ag-theme-material"
          animateRows={true}
          rowData={FeeDetails}
          columnDefs={StudentColumnDefs as any}
          alwaysShowHorizontalScroll
          onRowEditingStarted={(e) => {}}
          suppressScrollWhenPopupsAreOpen
          suppressFocusAfterRefresh
          suppressCellFocus
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
