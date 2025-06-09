"use client";
import {
  Input,
  Stack,
  Button,
  InputGroup,
  Card,
  IconButton,
} from "@chakra-ui/react";
import { useState } from "react";
import { useSignIn } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { toaster } from "@/components/ui/toaster";

const signInSchema = z.object({
  emailAddress: z.string().email(),
  password: z.string().min(1, "Required"),
});

export default function Home() {
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
  });
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const router = useRouter();
  const { signIn } = useSignIn();

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    try {
      const data = await signIn({
        email: values.emailAddress,
        password: values.password,
      });
      if (data) {
        router.refresh();
      }
    } catch (e) {
      toaster.error({ title: "Invalid credentials !" });
    }
  }

  return (
    <Card.Root minW={"sm"} size={"lg"}>
      <Card.Header>
        <Card.Title>Sign in to account</Card.Title>
        <Card.Description>Get started by signing in</Card.Description>
      </Card.Header>

      <Card.Body>
        <Form {...form}>
          <Stack maxW={"xl"} asChild gap={4}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                name="emailAddress"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <Input {...field} type="email" />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <PasswordInput {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                loading={form.formState.isSubmitting}
                loadingText={"Signing in..."}
                type="submit"
              >
                Sign in
              </Button>
            </form>
          </Stack>
        </Form>
      </Card.Body>
    </Card.Root>
  );
}
