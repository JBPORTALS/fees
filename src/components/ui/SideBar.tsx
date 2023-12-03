"use client";
import {
  MdList,
  MdOutlineList,
  MdOutlineSpaceDashboard,
  MdSpaceDashboard,
} from "react-icons/md";
import NavButton from "./utils/NavButton";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FormControl, Select } from "@chakra-ui/react";

export default function SideBar() {
  const pathname = usePathname();
  return (
    <div className="bg-secondary gap-4 flex flex-col border-r p-3 border-slate-300 w-full col-span-1">
      <FormControl>
        <Select rounded={"full"}>
          <option>2023</option>
        </Select>
      </FormControl>
      <Link href={"/dashboard"}>
        <NavButton
          active={pathname.startsWith("/dashboard")}
          icon={
            pathname.startsWith("/dashboard") ? (
              <MdSpaceDashboard />
            ) : (
              <MdOutlineSpaceDashboard />
            )
          }
        >
          Dashboard
        </NavButton>
      </Link>
      <Link href={"/students"}>
        <NavButton
          active={pathname.startsWith("/students")}
          icon={
            pathname.startsWith("/students") ? <MdList /> : <MdOutlineList />
          }
        >
          Students
        </NavButton>
      </Link>
    </div>
  );
}
