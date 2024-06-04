import {
  AbsoluteCenter,
  Box,
  Divider,
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "@chakra-ui/next-js";
import { usePathname, useSearchParams } from "next/navigation";
import { AiOutlineCheck } from "react-icons/ai";

interface GenerateRecieptLayoutProps {
  children: React.ReactNode;
}

export default function WithUSNLayout({
  children,
}: GenerateRecieptLayoutProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isInEditMode = searchParams.get("challan_id");

  return (
    <Tabs
      isLazy
      lazyBehavior="unmount"
      index={
        pathname == "/generate-reciept/with-usn/FEE"
          ? 0
          : pathname === "/generate-reciept/with-usn/MISCELLANEOUS"
          ? 1
          : pathname === "/generate-reciept/with-usn/BUS_FEE"
          ? 2
          : pathname === "/generate-reciept/with-usn/SECURITY_DEPOSIT"
          ? 3
          : pathname === "/generate-reciept/with-usn/HOSTEL_FEE"
          ? 4
          : -1
      }
      colorScheme={"purple"}
      size={"md"}
      variant={"soft-rounded"}
      h={"fit-content"}
      position={"relative"}
      zIndex={"sticky"}
    >
      <VStack gap={"0"} px={"36"}>
        <TabList
          position={"sticky"}
          zIndex={"popover"}
          bg={"whiteAlpha.100"}
          backdropBlur={"sm"}
          w={"full"}
          top={"0"}
          className="py-3 bg-white flex justify-between"
        >
          <Tab
            as={Link}
            href={"/generate-reciept/with-usn/FEE"}
            _hover={{ textDecoration: "none" }}
            gap={"2"}
          >
            Fee
            {pathname == "/generate-reciept/with-usn/FEE" && (
              <AiOutlineCheck className="text-md" />
            )}
          </Tab>
          <Tab
            as={Link}
            href={"/generate-reciept/with-usn/MISCELLANEOUS"}
            _hover={{ textDecoration: "none" }}
          >
            Miscellaneous
            {pathname == "/generate-reciept/with-usn/MISCELLANEOUS" && (
              <AiOutlineCheck className="text-md" />
            )}
          </Tab>
          <Tab
            as={Link}
            href={"/generate-reciept/with-usn/BUS_FEE"}
            _hover={{ textDecoration: "none" }}
          >
            Bus Fee
            {pathname == "/generate-reciept/with-usn/BUS_FEE" && (
              <AiOutlineCheck className="text-md" />
            )}
          </Tab>
          <Tab
            as={Link}
            href={"/generate-reciept/with-usn/SECURITY_DEPOSIT"}
            _hover={{ textDecoration: "none" }}
          >
            Security Deposit
            {pathname == "/generate-reciept/with-usn/SECURITY_DEPOSIT" && (
              <AiOutlineCheck className="text-md" />
            )}
          </Tab>
          <Tab
            as={Link}
            href={"/generate-reciept/with-usn/HOSTEL_FEE"}
            _hover={{ textDecoration: "none" }}
          >
            Hostel Fee
            {pathname == "/generate-reciept/with-usn/HOSTEL_FEE" && (
              <AiOutlineCheck className="text-md" />
            )}
          </Tab>
        </TabList>
        <Box
          position="relative"
          width={"100%"}
          py={isInEditMode ? "3" : "unset"}
        >
          <Divider />
          {isInEditMode && (
            <AbsoluteCenter bg="white" px="4">
              <Tag colorScheme={"green"}>
                Edit Mode: Challan ID-{searchParams.get("challan_id")}
              </Tag>
            </AbsoluteCenter>
          )}
        </Box>
      </VStack>
      <TabPanels
        px={"36"}
        height={"67vh"}
        position={"relative"}
        overflowY={"scroll"}
      >
        <TabPanel px={"5"}>{children}</TabPanel>
        <TabPanel px={"5"}>{children}</TabPanel>
        <TabPanel px={"5"}>{children}</TabPanel>
        <TabPanel px={"5"}>{children}</TabPanel>
        <TabPanel px={"5"}>{children}</TabPanel>
        <TabPanel px={"5"}>{children}</TabPanel>
      </TabPanels>
    </Tabs>
  );
}
