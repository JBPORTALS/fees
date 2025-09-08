"use client";
import {
  AbsoluteCenter,
  Box,
  HStack,
  Separator,
  Tabs,
  Tag,
  VStack,
} from "@chakra-ui/react";
import React from "react";

import { usePathname, useSearchParams } from "next/navigation";
import { AiOutlineCheck } from "react-icons/ai";
import Link from "next/link";

interface GenerateRecieptLayoutProps {
  children: React.ReactNode;
}

const items = [
  {
    title: "Fee",
    value: "FEE",
    href: "/generate-reciept/without-usn/FEE",
  },
  {
    title: "Others",
    value: "OTHERS",
    href: "/generate-reciept/without-usn/OTHERS",
  },
  {
    title: "Miscellaneous",
    value: "MISCELLANEOUS",
    href: "/generate-reciept/without-usn/MISCELLANEOUS",
  },
  {
    title: "Security",
    value: "SECURITY_DEPOSIT",
    href: "/generate-reciept/without-usn/SECURITY_DEPOSIT",
  },
  {
    title: "Bus",
    value: "BUS_FEE",
    href: "/generate-reciept/without-usn/BUS_FEE",
  },
  {
    title: "Hostel",
    value: "HOSTEL_FEE",
    href: "/generate-reciept/without-usn/HOSTEL_FEE",
  },
  {
    title: "Registration",
    value: "REGISTRATION_FEE",
    href: "/generate-reciept/without-usn/REGISTRATION_FEE",
  },
];

export default function WithoutUSNLayout({
  children,
}: GenerateRecieptLayoutProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isInEditMode = searchParams.get("challan_id");

  return (
    <Tabs.Root
      variant={"subtle"}
      lazyMount
      value={pathname.split("/").at(3)}
      size={"md"}
    >
      <VStack gap={"0"}>
        <Tabs.List
          position={"sticky"}
          zIndex={"popover"}
          backdropBlur={"sm"}
          w={"full"}
          top={"0"}
          display={"flex"}
        >
          {items.map((item) => (
            <Tabs.Trigger
              key={item.value}
              asChild
              value={item.value}
              _hover={{ textDecoration: "none" }}
              gap={"2"}
            >
              <Link href={item.href}>
                {item.title}
                {pathname == item.href && (
                  <AiOutlineCheck className="text-md" />
                )}
              </Link>
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        <Box
          position="relative"
          width={"100%"}
          py={isInEditMode ? "3" : "unset"}
        >
          {isInEditMode && (
            <React.Fragment>
              <Separator />
              <AbsoluteCenter px="4">
                <Tag.Root colorPalette={"green"}>
                  <Tag.Label>
                    Edit Mode: Challan ID-{searchParams.get("challan_id")}
                  </Tag.Label>
                </Tag.Root>
              </AbsoluteCenter>
            </React.Fragment>
          )}
        </Box>
      </VStack>
      <Tabs.ContentGroup py={"4"}>{children}</Tabs.ContentGroup>
    </Tabs.Root>
  );
}
