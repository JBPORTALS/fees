"use client";

import { useSearchParams } from "next/navigation";
import {
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
} from "@/components/ui/drawer";
import React from "react";
import { Box, Heading, Presence, VStack } from "@chakra-ui/react";

export function SearchRightBar() {
  const searchParams = useSearchParams();
  const searchType = searchParams.get("st");

  if (!searchType) return null; // or fallback content

  return (
    <Presence present>
      <VStack
        w="300px"
        borderLeftWidth={"thin"}
        minH={"svh"}
        borderColor="border"
        pt="4"
        pl="4"
        pr="4"
        position="sticky"
        inset={"0"}
        top={"16"}
        right={"0"}
      >
        <Heading size="md" mb="4">
          Search Results
        </Heading>
        <Box>Hurray !!!!</Box>
      </VStack>
    </Presence>
  );
}
