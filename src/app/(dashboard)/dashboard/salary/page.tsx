"use client";
import { Stack} from "@chakra-ui/react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
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
      <h1>Salary Manager</h1>
    </Stack>
  );
}
