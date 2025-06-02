import Link from "next/link";
import { Button, Center, HStack } from "@chakra-ui/react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="h-[100vh] flex-col justify-start w-full">
      <HStack
        justifyContent={"space-between"}
        className="backdrop-blur-sm"
        w={"full"}
        px={"16"}
        py={"3"}
      >
        <div className="relative h-10 w-32">
          <Image alt={"nexus"} src={"/nexuss.png"} priority sizes="10vh" fill />
        </div>
        <HStack>
          <Button size={"sm"} variant={"ghost"} colorScheme="blue" asChild>
            <Link href={"/signin"}>Signin</Link>
          </Button>
        </HStack>
      </HStack>
      <Center h={"full"}>
        <Button
          mt={"4"}
          size={"md"}
          variant={"outline"}
          colorScheme="blue"
          asChild
        >
          <Link href={"/signin"}>Signin</Link>
        </Button>
      </Center>
    </div>
  );
}
