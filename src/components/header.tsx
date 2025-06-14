"use client";

import {
  Avatar,
  Button,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  useDisclosure,
} from "@chakra-ui/react";
import {
  AiOutlineLogout,
  AiOutlineMail,
  AiOutlineSearch,
  AiOutlineUser,
} from "react-icons/ai";
import { HiOutlineOfficeBuilding } from "react-icons/hi";

import Link from "next/link";
import { useSignIn, useUser } from "@/utils/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ColorModeButton } from "./ui/color-mode";
import {
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "./ui/dialog";

export function Header() {
  const {
    open: isProfileOpen,
    onToggle: onProfileClose,
    onOpen: onProfileOpen,
  } = useDisclosure();

  const user = useUser();
  const { signOut } = useSignIn();
  const [query, setQuery] = useState("");

  const router = useRouter();

  return (
    <HStack
      w={"full"}
      position={"sticky"}
      px={"5"}
      justifyContent={"space-between"}
      h={"16"}
      gap={"3"}
      borderBottomColor={"border"}
      borderBottomWidth={"thin"}
      backdropBlur={"sm"}
      inset={0}
      zIndex={"2"}
      background={"Background"}
    >
      <Link href={"/dashboard"}>
        <Heading size={"xl"} fontWeight={"semibold"}>
          Fee Master
        </Heading>
      </Link>
      <HStack>
        <InputGroup
          rounded={"2xl"}
          endElement={
            <IconButton
              onClick={async () => {
                router.push(
                  `/dashboard/search?mode=QUERY&query=${query}&hash=${new Date(
                    Date.now()
                  ).getTime()}`
                );
              }}
              colorPalette="blue"
              h={"full"}
              w={"full"}
              variant={"ghost"}
              aria-label="search"
            >
              <AiOutlineSearch className="text-lg" />
            </IconButton>
          }
        >
          <Input
            onChange={(e) => setQuery(e.target.value)}
            value={query}
            size={"md"}
            rounded={"lg"}
            w={"96"}
            onKeyDown={(e) => {
              if (e.key === "Enter")
                router.push(
                  `/dashboard/search?mode=QUERY&query=${query}&hash=${new Date(
                    Date.now()
                  ).getTime()}`
                );
            }}
            placeholder="Search Student Name or Student USN"
          />
        </InputGroup>
      </HStack>
      <HStack>
        <HStack>
          <HStack>
            <Heading size={"md"}>{user?.fullname}</Heading>
            <IconButton
              onClick={onProfileOpen}
              variant={"plain"}
              aria-label="avatar"
            >
              <Avatar.Root size={"sm"}>
                <Avatar.Icon />
              </Avatar.Root>
            </IconButton>

            <ColorModeButton />
          </HStack>
          <DialogRoot
            open={isProfileOpen}
            size={"sm"}
            onOpenChange={onProfileClose}
          >
            <DialogContent
              position={"relative"}
              zIndex={"toast"}
              backdropBlur={"2xl"}
              shadow={"2xl"}
            >
              <DialogHeader>
                <DialogTitle>Profile Info</DialogTitle>
              </DialogHeader>
              <DialogBody>
                <HStack gap={"3"} py={"2"}>
                  <AiOutlineUser className="text-2xl" />
                  <Heading size={"sm"} fontWeight={"normal"}>
                    {user?.fullname}
                  </Heading>
                </HStack>
                <HStack gap={"3"} py={"2"}>
                  <AiOutlineMail className="text-2xl" />
                  <Heading size={"sm"} fontWeight={"normal"}>
                    {user?.email}
                  </Heading>
                </HStack>
                <HStack gap={"3"} py={"2"}>
                  <HiOutlineOfficeBuilding className="text-2xl" />
                  <Heading size={"sm"} fontWeight={"normal"}>
                    {user?.college}
                  </Heading>
                </HStack>

                <HStack gap={"3"} py={"2"}>
                  <Button
                    onClick={async () => {
                      await signOut();
                    }}
                    colorPalette="facebook"
                    w={"full"}
                  >
                    <AiOutlineLogout />
                    SignOut
                  </Button>
                </HStack>
              </DialogBody>
            </DialogContent>
          </DialogRoot>
        </HStack>
      </HStack>
    </HStack>
  );
}
