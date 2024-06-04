"use client";
import {
  MdList,
  MdOutlineList,
  MdOutlineSpaceDashboard,
  MdSpaceDashboard,
} from "react-icons/md";
import { NavButton } from "./utils/NavButton";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Button,
  Divider,
  FormControl,
  Select,
  VStack,
  useColorMode,
  useToast,
} from "@chakra-ui/react";
import { AiOutlinePlus } from "react-icons/ai";
import { FaUsers } from "react-icons/fa";
import { useAppDispatch } from "@/hooks";
import { changeAcadYear } from "@/store/fees.slice";
import { useAppSelector } from "@/store";

export default function SideBar() {
  const pathname = usePathname();
  const router = useRouter();
  const acadYear = useAppSelector((state) => state.fees.acadYear);
  const dispatch = useAppDispatch();
  const toast = useToast({
    position: "bottom",
    status: "info",
    variant: "subtle",
  });
  const { toggleColorMode, colorMode, setColorMode } = useColorMode();

  return (
    <VStack
      gap={4}
      bg={"Background"}
      borderRightWidth={"1px"}
      p={3}
      w={"full"}
      className=" col-span-1"
    >
      <VStack pb={15} pt={5} w={"full"} gap={4}>
        <NavButton
          as={Link}
          href={"/dashboard"}
          w={"full"}
          isActive={pathname.startsWith("/dashboard")}
          leftIcon={
            pathname.startsWith("/dashboard") ? (
              <MdSpaceDashboard />
            ) : (
              <MdOutlineSpaceDashboard />
            )
          }
        >
          Dashboard
        </NavButton>
        <Link href={"/students"} className="w-full">
          <NavButton
            w={"full"}
            isActive={pathname.startsWith("/students")}
            leftIcon={
              pathname.startsWith("/students") ? <FaUsers /> : <FaUsers />
            }
          >
            Students
          </NavButton>
        </Link>
      </VStack>
      <Divider />
      <Button
        as={Link}
        w={"full"}
        href={"/generate-reciept/without-usn"}
        size={"md"}
        rounded={"full"}
        variant={"outline"}
        leftIcon={<AiOutlinePlus className={"text-xl"} />}
      >
        New Receipt
      </Button>
      <FormControl>
        <Select
          rounded={"full"}
          value={acadYear}
          onChange={(e) => {
            dispatch(changeAcadYear(e.target.value));
            toast({ title: `Academic year changed to "${e.target.value}"` });
            router.refresh();
          }}
        >
          <option value={"2024"}>2024</option>
          <option value={"2023"}>2023</option>
        </Select>
      </FormControl>
      {/* <Select
        rounded={"full"}
        value={colorMode}
        onChange={(e) => {
          setColorMode(e.target.value);
        }}
      >
        <option value={"light"}>Light</option>
        <option value={"dark"}>Dark</option>
        <option value={"system"}>System</option>
      </Select> */}
    </VStack>
  );
}
