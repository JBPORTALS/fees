"use client";
import { Center, Spinner, VStack } from "@chakra-ui/react";

export default function Home() {
  return (
    <Center h={"100vh"} w={"full"}>
        <Spinner size={"xl"} color="blue" />
    </Center>
  );
}
