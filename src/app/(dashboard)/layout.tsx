import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { auth } from "@/utils/auth-server";
import { Box, HStack, VStack } from "@chakra-ui/react";
import { redirect } from "next/navigation";

export default async function DashboardRootLayout(props: {
  children: React.ReactNode;
}) {
  const { isLoggedIn } = await auth();

  if (!isLoggedIn) redirect("/signin");

  return (
    <VStack gap={"0"} alignItems={"start"} minH={"100vh"}>
      <Header />

      <HStack
        alignItems={"start"}
        justifyItems={"start"}
        zIndex={1}
        w={"full"}
        flex={"1"}
        gap={"0"}
      >
        <Sidebar />
        <Box
          w={"full"}
          flex={"1"}
          px={"5"}
          spaceY={"4"}
          py={"3"}
          asChild
          minW={"0"}
        >
          <main>{props?.children}</main>
        </Box>
      </HStack>
    </VStack>
  );
}
