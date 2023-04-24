"use client";
import AdmissionLayout from "@/components/layouts/AdmissionLayout";
import { useAppDispatch } from "@/hooks";
import {fetchSearchClass } from "@/store/admissions.slice";
import {
  Stack,
  VStack,
} from "@chakra-ui/react";
import { useEffect} from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import {useParams } from "next/navigation";
import ClassDataGrid from "@/components/layouts/ClassDataGrid";

export default function Home() {
  const dispatch = useAppDispatch();
  const router = useParams();

  useEffect(() => {
    dispatch(fetchSearchClass({college:router.college,branch:router.branch}));
  }, [router.college,router.branch]);

  return (
    <Stack h={"full"} w={"full"} justifyContent={"start"}>
      <AdmissionLayout showDownloadFile>
        <VStack h={"90vh"}>
        <ClassDataGrid/>
        </VStack>
      </AdmissionLayout>
    </Stack>
  );
}
