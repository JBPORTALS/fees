import {
  Avatar,
  Button,
  Heading,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import {
  AiOutlineDollarCircle,
  AiOutlineFieldTime,
  AiOutlineLogout,
  AiOutlineMail,
  AiOutlineUser,
} from "react-icons/ai";
import { useSupabase } from "@/app/supabase-provider";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import SideBar from "../ui/SideBar";

interface AttendanceLayoutProps {
  children: React.ReactNode;
}

export default function HeaderLayout({ children }: AttendanceLayoutProps) {
  const {
    isOpen: isProfileOpen,
    onClose: onProfileClose,
    onOpen: onProfileOpen,
  } = useDisclosure();

  const { user, supabase } = useSupabase();

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
          <AiOutlineDollarCircle className="text-3xl" />
          <Heading size={"md"}>Fee Manager</Heading>
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
