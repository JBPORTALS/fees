"use client";
import { Flex } from "@chakra-ui/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Flex minH={"100vh"} align={"center"} justify={"center"} bg={"gray.50"}>
      {children}
    </Flex>
  );
}
