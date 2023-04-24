"use client";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider prepend={false}>
      <Toaster />
      <ChakraProvider>{children}</ChakraProvider>
    </CacheProvider>
  );
}
