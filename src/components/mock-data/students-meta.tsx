import ViewStudentsDetails from "../drawers/ViewStudentDetails";
import { ColumnDef } from "@tanstack/react-table";
import { IconButton, Link } from "@chakra-ui/react";
import { LuArrowRight } from "react-icons/lu";
import { Status } from "../status";

export type Student = {
  id: string;
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

export const StudentColumnDefs: ColumnDef<Student>[] = [
  {
    accessorKey: "sl_no",
    header: "Sl No.",
  },
  {
    accessorKey: "regno",
    header: "USN",
    cell(props) {
      const original = props.row.original;
      return (
        <ViewStudentsDetails
          key={original.id}
          regno={original.regno}
          id={original.id}
        >
          {({ onOpen }) => (
            <Link onClick={onOpen}>{props.row.getValue("regno")}</Link>
          )}
        </ViewStudentsDetails>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell(props) {
      const original = props.row.original;
      return (
        <ViewStudentsDetails
          key={original.id}
          regno={original.regno}
          id={original.id}
        >
          {({ onOpen }) => (
            <Link onClick={onOpen}>{props.row.getValue("name")}</Link>
          )}
        </ViewStudentsDetails>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "sem",
    header: "Sem",
  },
  {
    accessorKey: "total1",
    header: "Total Amount",
  },
  {
    accessorKey: "paid1",
    header: "Paid Amount",
  },
  {
    accessorKey: "remaining1",
    header: "Balance Amount",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (props) => {
      const original = props.row.original;

      return <Status status={original.status} />;
    },
  },
  {
    id: "view",
    header: "View",
    cell: (props) => {
      const original = props.row.original;
      return (
        <ViewStudentsDetails
          key={original.id}
          regno={original.regno}
          id={original.id}
        >
          {({ onOpen }) => (
            <IconButton size={"sm"} variant={"ghost"}>
              <LuArrowRight onClick={onOpen} />
            </IconButton>
          )}
        </ViewStudentsDetails>
      );
    },
  },
];
