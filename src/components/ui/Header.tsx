import { useAppSelector } from "@/store";
import Supabase from "@/utils/supabase";
import {
  Avatar,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import Link from "next/link";
import React, { Children } from "react";
import { AiOutlineSync, AiOutlineUser } from "react-icons/ai";
import AddAttendanceModal from "../modals/AddAttendanceModal";
import Icon from "./utils/Icon";

interface HeaderProps {
  heading?: string | undefined;
  isFor: "admin" | "coadmin" | "staff";
  children: React.ReactNode;
}

export default function Header({ heading, children, isFor }: HeaderProps) {
  const user = useAppSelector((state) => state.auth.user) as any;
  return (
    <div className="h-[46px] w-full px-5 sticky backdrop-blur-sm border-b border-b-gray-200 flex items-center justify-center">
      <section className="w-full">
        {heading && (
          <HStack w={"full"} justifyContent={"space-between"}>
            <h1
              className={"text-gray-700 text-md font-medium whitespace-nowrap"}
            >
              {heading}
            </h1>
            {children}
          </HStack>
        )}
      </section>
      <section className="h-full w-full flex items-center justify-end space-x-3">
        {isFor == "staff" && (
          <AddAttendanceModal>
            {({ onOpen }) => (
              <Button
                onClick={onOpen}
                size={"sm"}
                colorScheme={"teal"}
                className={"shadow-md shadow-brandLight border-2"}
                leftIcon={<Icon IconName="attendance" />}
              >
                Mark Attendance
              </Button>
            )}
          </AddAttendanceModal>
        )}
        <Menu>
          <MenuButton>
            <Avatar
              className={"border-brand border-2 hover:cursor-pointer"}
              size={"sm"}
              src={
                user?.url &&
                Supabase()
                  .storage.from("media")
                  .getPublicUrl(user.url, { transform: { format: "origin" } })
                  .data.publicUrl+`&hash=${user?.hash}`
              }
            />
          </MenuButton>
          <MenuList zIndex={"toast"} shadow={"xl"} bg={"#FBFCFD"}>
            <Link href={`/${isFor}/verified/my-profile`}>
              <MenuItem
                bg={"#FBFCFD"}
                icon={<AiOutlineUser className="text-lg" />}
                _hover={{ bg: "#ECEEF0" }}
              >
                My Profile
              </MenuItem>
            </Link>
            {isFor !== "coadmin" && (
              <>
                <Link href={`/${isFor}/forgot-password`}>
                  <MenuItem
                    bg={"#FBFCFD"}
                    icon={<AiOutlineSync className="text-lg" />}
                    _hover={{ bg: "#ECEEF0" }}
                  >
                    Change Password
                  </MenuItem>
                </Link>
                <Link href={`/${isFor}/change-sec-ans`}>
                  <MenuItem
                    bg={"#FBFCFD"}
                    icon={<AiOutlineSync className="text-lg" />}
                    _hover={{ bg: "#ECEEF0" }}
                  >
                    Change Security Answers
                  </MenuItem>
                </Link>
              </>
            )}
          </MenuList>
        </Menu>
      </section>
    </div>
  );
}
