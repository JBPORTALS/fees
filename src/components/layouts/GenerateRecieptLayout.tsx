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
import { AiOutlineArrowLeft } from "react-icons/ai";

interface GenerateRecieptLayoutProps {
  children: React.ReactNode;
}

export default function GenerateRecieptLayout({
  children,
}: GenerateRecieptLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="bg-primary relative overflow-hidden w-full  h-full flex flex-col">
      <HStack px={"5"} py={"1"} className="border-gray-300 border-b">
        <IconButton
          as={Link}
          href={"/dashboard"}
          variant={"ghost"}
          rounded={"full"}
          aria-label="back"
          icon={<AiOutlineArrowLeft className="text-2xl" />}
        />
        <Heading size={"md"} color={"gray.600"}>
          Generate Reciept
        </Heading>
      </HStack>
      <Tabs
        isLazy
        lazyBehavior="unmount"
        index={
          pathname.startsWith("/generate-reciept/without-usn")
            ? 0
            : pathname.startsWith("/generate-reciept/with-usn")
            ? 1
            : -1
        }
        colorScheme={"facebook"}
        size={"lg"}
        variant={"line"}
        h={"full"}
      >
        <TabList
          zIndex={"sticky"}
          position={"sticky"}
          bg={"whiteAlpha.100"}
          backdropBlur={"sm"}
          w={"100vw"}
          className="px-5 border-b border-gray-300 bg-[rgba(255,255,255,0.5)] backdrop-blur-sm flex justify-between"
        >
          <HStack justifyContent={"space-between"} w={"full"}>
            <HStack>
              <Tab
                as={Link}
                href={"/generate-reciept/without-usn"}
                _hover={{ textDecoration: "none" }}
              >
                Without USN
              </Tab>
              <Tab
                as={Link}
                href={"/generate-reciept/with-usn"}
                _hover={{ textDecoration: "none" }}
              >
                With USN
              </Tab>
              <Tab
                as={Link}
                href={"/generate-reciept/new-admission"}
                _hover={{ textDecoration: "none" }}
              >
                New Admission
              </Tab>
            </HStack>
          </HStack>
        </TabList>
        <TabPanels h={"fit"}>
          <TabPanel p={"0"} w={"full"} h={"fit-content"}>
            {children}
          </TabPanel>
          <TabPanel px={"5"} w={"full"} h={"full"}>
            {children}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}
