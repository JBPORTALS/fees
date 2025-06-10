import { HStack, Heading, Separator, Tabs } from "@chakra-ui/react";
import React from "react";

import { usePathname } from "next/navigation";
import Link from "next/link";

interface GenerateRecieptLayoutProps {
  children: React.ReactNode;
}

export default function GenerateRecieptLayout({
  children,
}: GenerateRecieptLayoutProps) {
  const pathname = usePathname();

  return (
    <React.Fragment>
      <HStack>
        {/* <IconButton
          as={Link}
          href={"/dashboard"}
          variant={"ghost"}
          rounded={"full"}
          aria-label="back"
          icon={<AiOutlineArrowLeft className="text-2xl" />}
        /> */}
        <Heading size={"2xl"}>New Reciept</Heading>
      </HStack>
      <Tabs.Root
        lazyMount
        value={pathname.split("/").at(2)}
        variant={"subtle"}
        h={"full"}
        w={"full"}
      >
        <Tabs.List zIndex={"sticky"} position={"sticky"} backdropBlur={"sm"}>
          <HStack justifyContent={"space-between"} w={"full"}>
            <HStack>
              <Tabs.Trigger
                value="without-usn"
                asChild
                _hover={{ textDecoration: "none" }}
              >
                <Link href={"/generate-reciept/without-usn/FEE"}>
                  Without USN
                </Link>
              </Tabs.Trigger>
              <Tabs.Trigger
                value="with-usn"
                asChild
                _hover={{ textDecoration: "none" }}
              >
                <Link href={"/generate-reciept/with-usn/FEE"}>With USN</Link>
              </Tabs.Trigger>
            </HStack>
          </HStack>
        </Tabs.List>

        <Separator mt={"4"} />

        <Tabs.ContentGroup px={"10"} py={"4"}>
          {children}
        </Tabs.ContentGroup>
      </Tabs.Root>
    </React.Fragment>
  );
}
