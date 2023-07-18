import { Tooltip } from "@chakra-ui/react";
import { AiOutlineEye } from "react-icons/ai";
import Link from "next/link";
import ViewStudentsDetails from "../drawers/ViewStudentDetails";

const CustomViewButton = (data: any) => {
  return (
    <div className="flex hover:cursor-pointer hover:scale-110 active:scale-95 justify-center items-center text-2xl text-brand h-full w-full">
      <ViewStudentsDetails regno={data.value.regno} id={data.value.id}>
        {({ onOpen }) => <AiOutlineEye onClick={onOpen} />}
      </ViewStudentsDetails>
    </div>
  );
};

const StatusView = (data: {
  value: "NOT PAID" | "FULLY PAID" | "PARTIALLY PAID";
}) => {
  return (
    <Tooltip placement={"right"} hasArrow label={data.value}>
      <div className="flex hover:cursor-pointer hover:scale-110 justify-center items-center text-2xl text-brand h-full w-full">
        <div
          className={
            `h-5 w-5 rounded-full border border-white shadow-md ` +
            (data.value == "NOT PAID" && "bg-red-500 ") +
            (data.value == "PARTIALLY PAID" && " bg-brand ") +
            (data.value == "FULLY PAID" && " bg-green-500 ")
          }
        ></div>
      </div>
    </Tooltip>
  );
};

export const StudentColumnDefs = [
  {
    field: "regno",
    headerName: "USN",
  },
  {
    field: "name",
    headerName: "Name",
    resizable: true,
    suppressMovable: true,
  },
  {
    field: "category",
    headerName: "Category",
    width: "130px",
  },
  {
    field: "sem",
    headerName: "Sem",
    width: "100px",
  },
  {
    field: "total1",
    headerName: "Total Fee",
    width: "180px",
  },
  {
    field: "paid1",
    headerName: "Paid",
    width: "170px",
  },
  {
    field: "remaining1",
    headerName: "Balance",
    width: "170px",
    resizable: true,
  },
  {
    field: "status",
    headerName: "Status",
    resizable: true,
    filter: true,
    width: "120px",
    cellRenderer: StatusView,
    valueGetter: (params: any) => {
      return params.data.status;
    },
  },
  {
    field: "",
    headerName: "View",
    width: "110px",
    cellRenderer: CustomViewButton,
    valueGetter: (params: any) => {
      return params.data;
    },
  },
];
