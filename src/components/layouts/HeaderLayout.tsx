"use client";

import {
  Avatar,
  Button,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  Dialog,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import {
  AiOutlineLogout,
  AiOutlineMail,
  AiOutlineSearch,
  AiOutlineUser,
} from "react-icons/ai";
import { HiOutlineOfficeBuilding } from "react-icons/hi";

import SideBar from "../ui/SideBar";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useSignIn, useUser } from "@/utils/auth";

interface AttendanceLayoutProps {
  children: React.ReactNode;
}

export default function HeaderLayout({ children }: AttendanceLayoutProps) {
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
    <div className="bg-primary relative overflow-hidden w-full  h-full">
      <HStack
        w={"full"}
        zIndex={"banner"}
        px={"5"}
        justifyContent={"space-between"}
        h={"58px"}
        top={"0"}
        left={"0"}
        className="bg-secondary border-b border-b-lightgray"
      >
        <Link href={"/dashboard"}>
          <HStack color={"blue.600"}>
            <div className="relative flex h-8 w-28">
              <Image
                quality={100}
                alt={"nexuss"}
                src={"/nexuss.png"}
                priority
                sizes="10vh"
                fill
              />
            </div>
            <Heading
              fontFamily={"sans-serif"}
              size={"md"}
              pt={1.5}
              letterSpacing={1}
              position={"relative"}
              color={"gray.700"}
              fontWeight={"semibold"}
            >
              • Fee Master
            </Heading>
          </HStack>
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
                colorScheme="blue"
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
            </HStack>
            <Dialog.Root
              open={isProfileOpen}
              size={"sm"}
              onOpenChange={onProfileClose}
            >
              <Dialog.Content
                position={"relative"}
                zIndex={"toast"}
                backdropBlur={"2xl"}
                shadow={"2xl"}
              >
                <Dialog.Header fontWeight="semibold" fontSize={"lg"}>
                  Profile Info
                </Dialog.Header>
                <Dialog.Body>
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
                      colorScheme="facebook"
                      w={"full"}
                    >
                      <AiOutlineLogout />
                      SignOut
                    </Button>
                  </HStack>
                </Dialog.Body>
              </Dialog.Content>
            </Dialog.Root>
          </HStack>
        </HStack>
      </HStack>
      <div className="w-full min-h-full grid grid-cols-7 grid-flow-row">
        <SideBar />
        <div className="col-span-6 h-full w-full">{children}</div>
      </div>
    </div>
  );
}
