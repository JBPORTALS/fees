import { Tooltip } from "@chakra-ui/react";
import { AiOutlineEye, AiOutlineUser } from "react-icons/ai";
import { CiReceipt } from "react-icons/ci";
import ViewFeeDetailsModal from "../drawers/ViewFeeDetailsModal";
import ViewChallanDetails from "../drawers/ViewChallanDetails";
import ViewStudentsDetails from "../drawers/ViewStudentDetails";

const CustomViewButton = (data: any) => {
  return (
    <div className="flex hover:cursor-pointer hover:scale-110 active:scale-95 justify-center items-center text-2xl text-brand h-full w-full">
      <ViewFeeDetailsModal id={data.value.id} regno={data.value.regno}>
        {({ onOpen }) => <AiOutlineEye onClick={onOpen} />}
      </ViewFeeDetailsModal>
    </div>
  );
};

const CustomViewHistoryButton = (data: any) => {
  return (
    <div className="flex hover:cursor-pointer hover:scale-110 active:scale-95 justify-center items-center text-2xl text-brand h-full w-full">
      <ViewFeeDetailsModal id={data.value.id} regno={data.value.regno}>
        {({ onOpen }) => <CiReceipt onClick={onOpen} />}
      </ViewFeeDetailsModal>
    </div>
  );
};

const ProfileViewButton = (data: any) => {
  return (
    <div className="flex hover:cursor-pointer hover:scale-110 active:scale-95 justify-center items-center text-2xl text-brand h-full w-full">
      <ViewStudentsDetails regno={data.value.regno} id={data.value.id}>
        {({ onOpen }) => <AiOutlineUser onClick={onOpen} />}
      </ViewStudentsDetails>
    </div>
  );
};

const CustomViewChallanButton = (data: any) => {
  return (
    <div className="flex hover:cursor-pointer hover:scale-110 active:scale-95 justify-center items-center text-2xl text-brand h-full w-full">
      <ViewChallanDetails
        regno={data.value.usn}
        challan_id={data.value.challan_id}
      >
        {({ onOpen }) => <AiOutlineEye onClick={onOpen} />}
      </ViewChallanDetails>
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
    field: "sl_no",
    headerName: "Sl No.",
    filter: true,
    pinned: "left",
    resizable: true,
    suppressMovable: true,
    width:"100px"
  },
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


export const feeSearchColumns = [
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
    headerName: "Payment History",
    width: "160px",
    cellRenderer: CustomViewHistoryButton,
    valueGetter: (params: any) => {
      return params.data;
    },
  },
  {
    field: "",
    headerName: "Profile",
    width: "110px",
    cellRenderer: ProfileViewButton,
    valueGetter: (params: any) => {
      return params.data;
    },
  },
];

export const SearchColumns = [
  {
    field: "sl_no",
    headerName: "Sl No.",
    filter: true,
    pinned: "left",
    resizable: true,
    suppressMovable: true,
    width: "120px",
  },
  {
    field: "challan_id",
    headerName: "Challan Id",
    resizable: true,
    suppressMovable: true,
    width: "120px",
  },
  {
    field: "usn",
    headerName: "USN",
    width: "100px",
  },
  {
    field: "name",
    headerName: "Name",
    width: "170px",
  },
  {
    field: "branch",
    headerName: "Branch",
    width: "100px",
  },
  {
    field: "sem",
    headerName: "Sem",
    width: "80px",
  },
  {
    field: "date",
    headerName: "Date",
    width: "170px",
    resizable: true,
  },

  {
    field: "particulars",
    headerName: "Payment Mode",
    width: "170px",
    resizable: true,
  },
  {
    field: "payment_type",
    headerName: "Payment Type",
    width: "170px",
    resizable: true,
  },
  {
    field: "amount_paid1",
    headerName: "Amount Paid",
    width: "170px",
    resizable: true,
  },
  {
    field: "",
    headerName: "View",
    width: "110px",
    cellRenderer: CustomViewChallanButton,
    valueGetter: (params: any) => {
      return params.data;
    },
  },
];

export const columnsForNonUpdate = [
  {
    field: "sl_no",
    headerName: "Sl No.",
    filter: true,
    pinned: "left",
    resizable: true,
    suppressMovable: true,
    width:"100px"
  },
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
    headerName: "Total",
    resizable: true,
    suppressMovable: true,
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
