"use client";
import { HStack, Tabs } from "@chakra-ui/react";
import React from "react";

import { usePathname } from "next/navigation";
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

  return (
    <Tabs.Root
      variant={"subtle"}
      lazyMount
      value={pathname.split("/").at(3)}
      size={"md"}
    >
      <HStack>
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
      </HStack>
      <Tabs.ContentGroup py={"4"}>{children}</Tabs.ContentGroup>
    </Tabs.Root>
  );
}
