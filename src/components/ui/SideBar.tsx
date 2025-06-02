"use client";
import { MdOutlineSpaceDashboard, MdSpaceDashboard } from "react-icons/md";
import { NavButton } from "./utils/NavButton";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Button,
  Separator,
  Field,
  VStack,
  NativeSelect,
} from "@chakra-ui/react";
import { AiOutlinePlus } from "react-icons/ai";
import { FaUsers } from "react-icons/fa";
import { useAppDispatch } from "@/hooks";
import { changeAcadYear } from "@/store/fees.slice";
import { useAppSelector } from "@/store";
import { toaster } from "./toaster";

export default function SideBar() {
  const pathname = usePathname();
  const router = useRouter();
  const acadYear = useAppSelector((state) => state.fees.acadYear);
  const dispatch = useAppDispatch();

  return (
    <VStack
      gap={4}
      bg={"Background"}
      borderRightWidth={"1px"}
      p={3}
      pb={20}
      w={"full"}
      h={"full"}
      className=" col-span-1"
      justifyContent={"space-between"}
    >
      <VStack pb={15} pt={5} w={"full"} gap={4}>
        <NavButton
          asChild
          w={"full"}
          isActive={pathname.startsWith("/dashboard")}
        >
          <Link href={"/dashboard"}>
            {pathname.startsWith("/dashboard") ? (
              <MdSpaceDashboard />
            ) : (
              <MdOutlineSpaceDashboard />
            )}
            Dashboard
          </Link>
        </NavButton>
        <NavButton
          w={"full"}
          asChild
          isActive={pathname.startsWith("/students")}
        >
          <Link href={"/students"} className="w-full">
            {pathname.startsWith("/students") ? <FaUsers /> : <FaUsers />}
            Students
          </Link>
        </NavButton>
      </VStack>
      <VStack w={"full"} gap={4}>
        <Separator />
        <Button
          asChild
          w={"full"}
          size={"md"}
          variant={"solid"}
          colorScheme="facebook"
        >
          <Link href={"/generate-reciept/without-usn"}>
            <AiOutlinePlus className={"text-xl"} />
            New Receipt
          </Link>
        </Button>
        <Field.Root>
          <NativeSelect.Root>
            <NativeSelect.Field
              value={acadYear}
              onChange={(e) => {
                dispatch(changeAcadYear(e.target.value));
                toaster.info({
                  title: `Academic year changed to "${e.target.value}"`,
                });
                router.refresh();
              }}
            >
              <option value={"2025"}>2025</option>
              <option value={"2024"}>2024</option>
              <option value={"2023"}>2023</option>
            </NativeSelect.Field>
          </NativeSelect.Root>
        </Field.Root>
      </VStack>
    </VStack>
  );
}
