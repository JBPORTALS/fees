"use client";
import { useSupabase } from "@/app/supabase-provider";
import {
  FormControl,
  Input,
  Stack,
  Button,
  Heading,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const { supabase } = useSupabase();

  const onReset = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/reset-password",
    });
    if (error) toast.error(error.message);
    else toast.success("Sent a password reset request");
    setIsLoading(false);
  };

  return (
    <Stack
      spacing={4}
      w={"full"}
      maxW={"md"}
      bg={"white"}
      rounded={"xl"}
      boxShadow={"lg"}
      p={6}
      my={12}
    >
      <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
        Forgot your password?
      </Heading>
      <Text fontSize={{ base: "sm", sm: "md" }} color={"gray.800"}>
        You&apos;ll get an email with a reset link
      </Text>
      <FormControl id="email">
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your-email@example.com"
          _placeholder={{ color: "gray.500" }}
          type="email"
        />
      </FormControl>
      <Stack spacing={6}>
        <Button
          isDisabled={!email}
          onClick={onReset}
          bg={"blue.400"}
          color={"white"}
          isLoading={isLoading}
          _hover={{
            bg: "blue.500",
          }}
        >
          Request Reset
        </Button>
      </Stack>
    </Stack>
  );
}
