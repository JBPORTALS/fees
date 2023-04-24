"use client";
import AdmissionLayout from "@/components/layouts/AdmissionLayout";
import { OverallColumn, columns } from "@/components/mock-data/admission-meta";
import { useAppDispatch } from "@/hooks";
import { useAppSelector } from "@/store";
import { fetchBranchList, fetchOverallMatrix, fetchSearchClass } from "@/store/admissions.slice";
import {
    Center,
  Heading,
  Progress,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Tr,
} from "@chakra-ui/react";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useState } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import { Link } from "@chakra-ui/next-js";
import { useRouter } from "next/router";
import { useSearchParams, useParams } from "next/navigation";
import axios from "axios";

export default function Home() {
  const dispatch = useAppDispatch();
  const router = useParams();
  const data = useAppSelector(state=>state.admissions.search_class.data) as any;
  const error = useAppSelector(state=>state.admissions.search_class.error) as string | null;

  useEffect(() => {
    dispatch(fetchSearchClass({college:router.college,branch:router.branch}));
  }, [router.college,router.branch]);

  return (
    <Stack h={"full"} w={"full"} justifyContent={"start"}>
      <AdmissionLayout>
        <div className="ag-theme-material">
        {error ? (
            <Center pb={"28"} w={"full"} h={"full"}>
              <Heading>{error}</Heading>
            </Center>
          ) : (
            <AgGridReact
              alwaysShowHorizontalScroll
              animateRows={true}
              className="w-full h-full  pb-6 ag-theme-material"
              rowData={data as any}
              columnDefs={columns as any}
            />
          )}
        </div>
      </AdmissionLayout>
    </Stack>
  );
}