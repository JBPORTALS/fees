import { Tooltip } from "@chakra-ui/react";
import { AiOutlineEye } from "react-icons/ai";
import ViewStudentsDetails from "../drawers/ViewStudentDetails";
import {
  CellRendererSelectorFunc,
  CellRendererSelectorResult,
  ColDef,
  ICellRendererParams,
} from "ag-grid-community";

export type Student = {
  sl_no: string;
  regno: string;
  name: string;
  category: string;
  sem: string;
  total1: string;
  paid1: string;
  remaining1: string;
  status: "NOT PAID" | "FULLY PAID" | "PARTIALLY PAID";
};

const CustomViewButton = (data: any) => {
  return (
    <div
      key={data.value.id}
      className="flex hover:cursor-pointer hover:scale-110 active:scale-95 justify-center items-center text-2xl text-brand h-full w-full"
    >
      <ViewStudentsDetails
        key={data.value.id}
        regno={data.value.regno}
        id={data.value.id}
      >
        {({ onOpen }) => <AiOutlineEye onClick={onOpen} />}
      </ViewStudentsDetails>
    </div>
  );
};

const StatusView = (
  data: ICellRendererParams<Student, Student["status"], Student["status"]>
): React.ReactElement => {
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

export const StudentColumnDefs: ColDef<Student>[] = [
  {
    field: "sl_no",
    headerName: "Sl No.",
    filter: true,
    pinned: "left",
    resizable: true,
    suppressMovable: true,
    width: 140,
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
    width: 160,
  },
  {
    field: "sem",
    headerName: "Sem",
    width: 100,
  },
  {
    field: "total1",
    headerName: "Total Amount",
    width: 180,
  },
  {
    field: "paid1",
    headerName: "Paid Amount",
    width: 170,
  },
  {
    field: "remaining1",
    headerName: "Balance Amount",
    width: 170,
    resizable: true,
  },
  {
    field: "status",
    headerName: "Status",
    resizable: true,
    filter: true,
    width: 120,
    cellRendererSelector: (params) => {
      return {
        component: StatusView,
        params: {
          status: params.data?.status,
        },
      };
    },
    valueGetter: (params: any) => {
      return params.data.status;
    },
  },
  {
    field: "",
    headerName: "View",
    width: 110,
    keyCreator(params) {
      return params.data.sl_no;
    },
    sortable: false,
    cellRendererSelector: (params) => {
      return {
        component: CustomViewButton,
        params: {
          data: params.data,
        },
      };
    },
    valueGetter: (params) => {
      return params.data;
    },
  },
];
