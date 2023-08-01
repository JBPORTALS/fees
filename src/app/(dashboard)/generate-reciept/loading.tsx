"use client";
import { Center, Spinner, VStack } from "@chakra-ui/react";

export default function Home() {
  return (
    <Center h={"full"} w={"full"}>
        <Spinner size={"xl"} color="blue" />
    </Center>
  );
}
