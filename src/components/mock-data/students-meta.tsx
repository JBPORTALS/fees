import { Tooltip } from "@chakra-ui/react";
import { AiOutlineEye } from "react-icons/ai";
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
    field: "sl_no",
    headerName: "Sl No.",
    filter: true,
    pinned: "left",
    resizable: true,
    suppressMovable: true,
    width:"140px"
  },
  {
    field: "regno",
    headerName: "USN",
    filter: true,
    pinned: "left",
    resizable: true,
    suppressMovable: true,
  },
  {
    field: "name",
    headerName: "Name",
    resizable: true,
    suppressMovable: true,
    filter: true,
    pinned: "left",
  },
  {
    field: "category",
    headerName: "Category",
    width: "160px",
  },
  {
    field: "sem",
    headerName: "Sem",
    width: "100px",
  },
  {
    field: "total1",
    headerName: "Total Amount",
    width: "180px",
  },
  {
    field: "paid1",
    headerName: "Paid Amount",
    width: "170px",
  },
  {
    field: "remaining1",
    headerName: "Balance Amount",
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
