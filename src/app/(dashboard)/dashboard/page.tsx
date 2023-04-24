"use client";
import { Stack, Button, Heading } from "@chakra-ui/react";

export default function Home() {
  return (
    <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
      <Heading fontSize={"3xl"}>Manoj</Heading>
      <Stack spacing={10}>
        <Button colorScheme="blue" color={"white"}>
          Sign out
        </Button>
      </Stack>
    </Stack>
  );
}
