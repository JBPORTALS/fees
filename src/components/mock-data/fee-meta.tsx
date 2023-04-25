import { Tooltip } from "@chakra-ui/react";
import { AiOutlineEye } from "react-icons/ai";
import ViewFeeDetailsModal from "../drawers/ViewFeeDetailsModal";

const CustomViewButton = (data: any) => {
  return (
    <div className="flex hover:cursor-pointer hover:scale-110 active:scale-95 justify-center items-center text-2xl text-brand h-full w-full">
      <ViewFeeDetailsModal regno={data.value.regno}>
        {({ onOpen }) => <AiOutlineEye onClick={onOpen} />}
      </ViewFeeDetailsModal>
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

export const columns = [
  {
    field: "regno",
    headerName: "Reg No.",
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
  },
  {
    field: "total1",
    headerName: "Total Fee",
    width:"180px"
  },
  {
    field: "paid1",
    headerName: "Paid",
    width:"170px"
  },
  {
    field: "remaining1",
    headerName: "Balance",
    width:"170px",
    resizable: true,
  },
  
  {
    field: "status",
    headerName: "Status",
    resizable: true,
    filter: true,
    width:"120px",
    cellRenderer: StatusView,
    valueGetter: (params: any) => {
      return params.data.status;
    },
  },
  {
    field: "",
    headerName: "View",
    width:"110px",
    cellRenderer: CustomViewButton,
    valueGetter: (params: any) => {
      return params.data;
    },
  },
];
