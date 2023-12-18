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
import { Button, Divider, FormControl, Select, VStack } from "@chakra-ui/react";
import { AiOutlinePlus } from "react-icons/ai";
import { FaUsers } from "react-icons/fa";

export default function SideBar() {
  const pathname = usePathname();
  return (
    <div className="bg-secondary gap-4 flex flex-col border-r p-3 border-slate-300 w-full col-span-1">
      <VStack pb={15} pt={5} w={"full"} gap={4}>
        <Link href={"/dashboard"} className="w-full">
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
        <Link href={"/students"} className="w-full">
          <NavButton
            active={pathname.startsWith("/students")}
            icon={pathname.startsWith("/students") ? <FaUsers /> : <FaUsers />}
          >
            Students
          </NavButton>
        </Link>
      </VStack>
      <Divider />
      <Button
        as={Link}
        href={"/generate-reciept/without-usn"}
        size={"md"}
        rounded={"full"}
        leftIcon={<AiOutlinePlus className={"text-xl"} />}
        colorScheme={"facebook"}
      >
        New Reciept
      </Button>
      <FormControl>
        <Select rounded={"full"}>
          <option>2023</option>
        </Select>
      </FormControl>
    </div>
  );
}
