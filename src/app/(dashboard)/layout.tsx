import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Box, HStack, VStack } from "@chakra-ui/react";

export default async function DashboardRootLayout(props: {
  children: React.ReactNode;
}) {
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
        <Box w={"full"} flex={"1"} asChild minW={"0"}>
          <main>{props?.children}</main>
        </Box>
      </HStack>
    </VStack>
  );
}
