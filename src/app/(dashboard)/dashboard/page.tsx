"use client";
import { Stack,  } from "@chakra-ui/react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import ClassDataGrid from "@/components/layouts/ClassDataGrid";
import FeesLayout from "@/components/layouts/FeesLayout";
import {useEffect} from "react"
import { fetchBranchList } from "@/store/fees.slice";
import { useAppDispatch } from "@/hooks";

export default function Home(){
  const dispatch = useAppDispatch();

  useEffect(()=>{
    dispatch(fetchBranchList())
  },[]);

  return (
    <Stack h={"full"} w={"full"} justifyContent={"start"}>
      <FeesLayout isFor="admin">
        <ClassDataGrid/>
      </FeesLayout>
    </Stack>
  );
}
