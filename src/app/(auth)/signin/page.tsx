"use client";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
} from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { SC } from "@/utils/supabase";
import { useRouter } from "next/navigation";
import { useSignIn } from "@/utils/auth";

export default function Home() {
  const [state, setState] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { signIn } = useSignIn();

  const onSignin = async () => {
    setIsLoading(true);
    try {
      const data = await signIn({
        email: state.email,
        password: state.password,
      });
      if (data) {
        router.refresh();
      }
    } catch (e) {
      toast.error("Invalid credentials !");
    }

    setIsLoading(false);
  };

  return (
    <Stack spacing={8} mx={"auto"} maxW={"md"} py={12} px={6}>
      <Stack align={"center"}>
        <Heading fontSize={"3xl"}>Sign in to Fee Manager</Heading>
        <Text fontSize={"lg"} color={"gray.600"}>
          To manage Fee Details
        </Text>
      </Stack>
      <Box rounded={"lg"} bg={"white"} boxShadow={"lg"} p={8}>
        <Stack spacing={4}>
          <FormControl id="email">
            <FormLabel>Email address</FormLabel>
            <Input
              value={state.email}
              onChange={(e) =>
                setState((prev) => ({ ...prev, email: e.target.value }))
              }
              type="email"
            />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input
              value={state.password}
              onChange={(e) =>
                setState((prev) => ({ ...prev, password: e.target.value }))
              }
              type="password"
            />
          </FormControl>
          <Stack spacing={2}>
            {/* <Stack
              direction={{ base: "column", sm: "row" }}
              align={"start"}
              justify={"end"}
            >
              <Link href={"/forgot-password"} color={"blue.400"}>
                Forgot password?
              </Link>
            </Stack> */}
            <Button
              isLoading={isLoading}
              onClick={onSignin}
              isDisabled={!state.email || !state.password}
              colorScheme="blue"
              color={"white"}
              loadingText={"Signing in..."}
            >
              Sign in
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
}
