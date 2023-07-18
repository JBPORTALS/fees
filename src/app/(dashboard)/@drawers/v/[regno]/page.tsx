"use client";
import ViewStudentsDetails from "@/components/drawers/ViewStudentDetails";
import { useParams } from "next/navigation";

export default function ViewStudentPage() {
  const params = useParams();
  console.log(params);
  return <ViewStudentsDetails />;
}
