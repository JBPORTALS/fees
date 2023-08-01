"use client";
import { Center, Spinner } from "@chakra-ui/react";

export default function Home() {
  return (
    <Center h={"full"} w={"full"}>
      <Spinner size={"xl"} color="blue" />
    </Center>
  );
}
