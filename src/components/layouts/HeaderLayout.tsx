import {
  Avatar,
  Button,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  AiOutlineFieldTime,
  AiOutlineLogout,
  AiOutlineMail,
  AiOutlineSearch,
  AiOutlineUser,
} from "react-icons/ai";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import SideBar from "../ui/SideBar";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAppDispatch } from "@/hooks";
import { fetchYearList } from "@/store/fees.slice";
import { useAppSelector } from "@/store";
import { SC } from "@/utils/supabase";

interface AttendanceLayoutProps {
  children: React.ReactNode;
}

export default function HeaderLayout({ children }: AttendanceLayoutProps) {
  const {
    isOpen: isProfileOpen,
    onClose: onProfileClose,
    onOpen: onProfileOpen,
  } = useDisclosure();

  const supabase = SC();
  const user = useAppSelector(state => state.fees.user)
  const [query, setQuery] = useState("");

  const router = useRouter();

  const dispatch = useAppDispatch();


  return (
    <div className="bg-primary relative overflow-hidden w-full  h-[100vh]">
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
          <Heading size={"md"} position={"relative"} color={"gray.600"}>
            | Fee Master
          </Heading>
        </HStack>
        <HStack>
          <InputGroup rounded={"2xl"}>
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
            <InputRightElement>
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
                icon={<AiOutlineSearch className="text-lg" />}
              />
            </InputRightElement>
          </InputGroup>
        </HStack>
        <HStack>
          <HStack>
            <HStack>
              <Heading size={"md"}>{user?.username}</Heading>
              <IconButton
                onClick={onProfileOpen}
                variant={"unstyled"}
                aria-label="avatar"
              >
                <Avatar size={"sm"}></Avatar>
              </IconButton>
            </HStack>
            <Modal isOpen={isProfileOpen} size={"sm"} onClose={onProfileClose}>
              <ModalOverlay className="backdrop-blur-sm" />
              <ModalContent
                position={"relative"}
                zIndex={"toast"}
                backdropBlur={"2xl"}
                shadow={"2xl"}
              >
                <ModalHeader fontWeight="semibold" fontSize={"lg"}>
                  Profile Info
                </ModalHeader>
                <ModalBody>
                  <HStack spacing={"3"} py={"2"}>
                    <AiOutlineUser className="text-2xl" />
                    <Heading size={"sm"} fontWeight={"normal"}>
                      {user?.username}
                    </Heading>
                  </HStack>
                  <HStack spacing={"3"} py={"2"}>
                    <AiOutlineMail className="text-2xl" />
                    <Heading size={"sm"} fontWeight={"normal"}>
                      {user?.email}
                    </Heading>
                  </HStack>
                  <HStack spacing={"3"} py={"2"}>
                    <HiOutlineOfficeBuilding className="text-2xl" />
                    <Heading size={"sm"} fontWeight={"normal"}>
                      {user?.college}
                    </Heading>
                  </HStack>
                  <HStack spacing={"3"} py={"2"}>
                    <AiOutlineFieldTime className="text-2xl" />
                    <Heading size={"sm"} fontWeight={"normal"}>
                      {moment(user?.last_login_at).format(
                        "MMMM Do YYYY, h:mm a"
                      )}
                    </Heading>
                  </HStack>
                  <HStack spacing={"3"} py={"2"}>
                    <Button
                      leftIcon={<AiOutlineLogout />}
                      onClick={async () => {
                        await supabase
                          .from("profiles")
                          .update({ last_login_at: new Date(Date.now()) })
                          .eq("id", user?.session?.user.id);
                        await supabase.auth.signOut();
                        router.refresh();
                      }}
                      colorScheme="facebook"
                      w={"full"}
                    >
                      SignOut
                    </Button>
                  </HStack>
                </ModalBody>
              </ModalContent>
            </Modal>
          </HStack>
        </HStack>
      </HStack>
      <div className="w-full h-full grid grid-cols-7 grid-flow-row">
        <SideBar />
        <div className="col-span-6 h-full w-full">{children}</div>
      </div>
    </div>
  );
}
