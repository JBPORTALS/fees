"use client";
import { store } from "@/store";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
    <CacheProvider prepend={false}>
      <Toaster />
      <ChakraProvider>{children}</ChakraProvider>
    </CacheProvider>
    </Provider>
  );
}
