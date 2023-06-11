import {
  HStack,
  Heading,
  IconButton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "@chakra-ui/next-js";
import { usePathname } from "next/navigation";
import { AiOutlineArrowLeft, AiOutlineCheck } from "react-icons/ai";

interface GenerateRecieptLayoutProps {
  children: React.ReactNode;
}

export default function WithUSNLayout({
  children,
}: GenerateRecieptLayoutProps) {
  const pathname = usePathname();

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
          : pathname === "/generate-reciept/with-usn/EXCESS_FEE"
          ? 3
          : pathname === "/generate-reciept/with-usn/SECURITY_DEPOSIT"
          ? 4
          : pathname === "/generate-reciept/with-usn/HOSTEL_FEE"
          ? 5
          : -1
      }
      colorScheme={"purple"}
      size={"md"}
      variant={"soft-rounded"}
      h={"fit-content"}
      position={"relative"}
    >
      <HStack px={"36"}>
        <TabList
          position={"sticky"}
          zIndex={"popover"}
          bg={"whiteAlpha.100"}
          backdropBlur={"sm"}
          w={"full"}
          top={"0"}
          className="py-3 border-b border-gray-200 bg-[rgba(255,255,255,0.5)] backdrop-blur-sm flex justify-between"
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
            href={"/generate-reciept/with-usn/EXCESS_FEE"}
            _hover={{ textDecoration: "none" }}
          >
            Excess Fee
            {pathname == "/generate-reciept/with-usn/EXCESS_FEE" && (
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
      </HStack>
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
