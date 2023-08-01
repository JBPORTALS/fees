"use client";
import { Center, Spinner, VStack } from "@chakra-ui/react";
import Image from "next/image";

export default function Home() {
  return (
    <Center h={"full"} w={"full"}>
      <VStack gap={"3"}>
        <div className="relative h-20 w-64">
          <Image
            alt={"ismart"}
            src={"/nexuss.png"}
            priority
            sizes="50vh"
            quality={100}
            fill
          />
        </div>
        <Spinner size={"md"} color="blue" />
      </VStack>
    </Center>
  );
}
