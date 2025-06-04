import { auth } from "@/utils/auth-server";
import { redirect } from "next/navigation";
import { Flex } from "@chakra-ui/react";

export default async function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn } = await auth();

  if (isLoggedIn) redirect("/dashboard");

  return (
    <Flex minH={"100vh"} align={"center"} justify={"center"}>
      {children}
    </Flex>
  );
}
