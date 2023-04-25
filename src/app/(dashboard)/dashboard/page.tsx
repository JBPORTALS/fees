"use client";
import { Stack,  } from "@chakra-ui/react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import ClassDataGrid from "@/components/layouts/ClassDataGrid";
import FeesLayout from "@/components/layouts/FeesLayout";

export default function Home(){

  return (
    <Stack h={"full"} w={"full"} justifyContent={"start"}>
      <FeesLayout isFor="admin">
        <ClassDataGrid/>
      </FeesLayout>
    </Stack>
  );
}
