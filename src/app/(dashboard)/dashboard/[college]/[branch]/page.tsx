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
  VStack,
} from "@chakra-ui/react";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useState } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import { Link } from "@chakra-ui/next-js";
import { useRouter } from "next/router";
import { useSearchParams, useParams } from "next/navigation";
import axios from "axios";
import ClassDataGrid from "@/components/layouts/ClassDataGrid";

export default function Home() {
  const dispatch = useAppDispatch();
  const router = useParams();

  useEffect(() => {
    dispatch(fetchSearchClass({college:router.college,branch:router.branch}));
  }, [router.college,router.branch]);

  return (
    <Stack h={"full"} w={"full"} justifyContent={"start"}>
      <AdmissionLayout>
        <VStack h={"90vh"}>
        <ClassDataGrid/>
        </VStack>
      </AdmissionLayout>
    </Stack>
  );
}
