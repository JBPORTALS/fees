"use client";
import { useSupabase } from "@/app/supabase-provider";
import {
  FormControl,
  Input,
  Stack,
  Button,
  Heading,
  FormLabel,
  Center,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function Home() {
  const [isLoading, setisLoading] = useState(false);
  const [password, setPassword] = useState("");
  const { supabase } = useSupabase();
  const router = useRouter();

  const onPasswordChange = async () => {
    setisLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      toast.error(error.message);
      setisLoading(false);
    } else router.replace("/signin");
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
        Reset Password
      </Heading>
      <FormControl id="new password" isRequired>
        <FormLabel>New Password</FormLabel>
        <Input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          placeholder="******"
          _placeholder={{ color: "gray.500" }}
          type="password"
        />
      </FormControl>
      <Stack spacing={6}>
        <Button
          isLoading={isLoading}
          isDisabled={!password}
          onClick={onPasswordChange}
          bg={"blue.400"}
          color={"white"}
          _hover={{
            bg: "blue.500",
          }}
        >
          Submit
        </Button>
      </Stack>
    </Stack>
  );
}
