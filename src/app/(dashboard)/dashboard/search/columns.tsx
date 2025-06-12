"use client";

import ViewFeeDetailsModal from "@/components/drawers/ViewFeeDetailsModal";
import ViewStudentsDetails from "@/components/drawers/ViewStudentDetails";
import { Student } from "@/components/mock-data/students-meta";
import { Status } from "@/components/status";
import { IconButton, Link } from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import { LuArrowRight } from "react-icons/lu";

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "sl_no",
    header: "Sl No.",
  },
  {
    accessorKey: "regno",
    header: "Reg No.",
    cell(props) {
      const original = props.row.original;
      return (
        <ViewFeeDetailsModal id={original.id} regno={original.regno}>
          {({ onOpen }) => (
            <Link onClick={onOpen}>{props.row.getValue("regno")}</Link>
          )}
        </ViewFeeDetailsModal>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell(props) {
      const original = props.row.original;
      return (
        <ViewFeeDetailsModal id={original.id} regno={original.regno}>
          {({ onOpen }) => (
            <Link onClick={onOpen}>{props.row.getValue("name")}</Link>
          )}
        </ViewFeeDetailsModal>
      );
    },
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
    cell(props) {
      return <Status status={props.row.original.status} />;
    },
  },
  {
    accessorKey: "",
    header: "View",
    cell(props) {
      const original = props.row.original;
      return (
        <ViewFeeDetailsModal id={original.id} regno={original.regno}>
          {({ onOpen }) => (
            <IconButton size={"sm"} variant={"ghost"}>
              <LuArrowRight onClick={onOpen} />
            </IconButton>
          )}
        </ViewFeeDetailsModal>
      );
    },
  },
];

export const columnsWithFee: ColumnDef<Student>[] = [
  {
    accessorKey: "regno",
    header: "Reg No.",
    cell(props) {
      const original = props.row.original;
      return (
        <ViewFeeDetailsModal id={original.id} regno={original.regno}>
          {({ onOpen }) => (
            <Link onClick={onOpen}>{props.row.getValue("regno")}</Link>
          )}
        </ViewFeeDetailsModal>
      );
    },
  },

  {
    accessorKey: "name",
    header: "Name",
    cell(props) {
      const original = props.row.original;
      return (
        <ViewFeeDetailsModal id={original.id} regno={original.regno}>
          {({ onOpen }) => (
            <Link onClick={onOpen}>{props.row.getValue("name")}</Link>
          )}
        </ViewFeeDetailsModal>
      );
    },
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
    cell(props) {
      return <Status status={props.row.original.status} />;
    },
  },
  {
    accessorKey: "",
    header: "Payment History",
    cell(props) {
      const original = props.row.original;
      return (
        <ViewFeeDetailsModal id={original.id} regno={original.regno}>
          {({ onOpen }) => (
            <IconButton size={"sm"} variant={"ghost"}>
              <LuArrowRight onClick={onOpen} />
            </IconButton>
          )}
        </ViewFeeDetailsModal>
      );
    },
  },
  {
    accessorKey: "",
    header: "Profile",
    cell(props) {
      const original = props.row.original;
      return (
        <ViewStudentsDetails id={original.id} regno={original.regno}>
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
