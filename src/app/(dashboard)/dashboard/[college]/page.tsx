"use client";
import AdmissionLayout from "@/components/layouts/AdmissionLayout";
import { OverallColumn } from "@/components/mock-data/admission-meta";
import { useAppDispatch } from "@/hooks";
import { useAppSelector } from "@/store";
import { fetchOverallMatrix } from "@/store/admissions.slice";
import {
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
  const [data, setData] = useState({ data: [], error: null });

  useEffect(() => {
    async function fetchData() {
      const formData = new FormData();
      formData.append("college", router.college);
      const response = await axios(
        process.env.NEXT_PUBLIC_ADMISSIONS_URL + "retrievebranchmatrix.php",
        {
          method: "POST",
          data: formData,
        }
      );
      if (response.status == 402)
        setData({ data: [], error: response.data?.msg });
      else setData({ data: response.data, error: null });
    }

    fetchData()
  }, [router.college]);

  return (
    <Stack h={"full"} w={"full"} justifyContent={"start"}>
      <AdmissionLayout>
        <div className="ag-theme-material">
          <Table colorScheme="gray" size={"lg"}>
            <Tbody>
              <Tr>
                <Th>Branch</Th>
                <Th>Total Seats</Th>
                <Th>Allotted Seats</Th>
                <Th>Remaining Seats</Th>
                <Th>Filled Percentage</Th>
              </Tr>
              {data.data.map((value: any) => {
                return (
                  <Tr>
                    <Td>
                      <Link href={"/dashboard/" + router.college+`/${value.branch}`}>
                        <div className="flex justify-center items-center text-md hover:underline h-full w-full">
                          {value.branch}
                        </div>
                      </Link>
                    </Td>
                    <Td>{value.total}</Td>
                    <Td>{value.allotted_seats}</Td>
                    <Td>{value.remaining_seats}</Td>
                    <Td>
                      <div className="flex flex-col justify-center items-center relative text-xl text-black h-full w-full">
                        <h3 className="z-2 text-brand drop-shadow-lg">
                          {value.filled_percentage} %
                        </h3>
                        <Progress
                          w={"full"}
                          hasStripe
                          value={value.filled_percentage}
                          rounded={"full"}
                          isAnimated
                          isIndeterminate={value.filled_percentage == undefined}
                          size="sm"
                          colorScheme="blue"
                        />
                      </div>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </div>
      </AdmissionLayout>
    </Stack>
  );
}
