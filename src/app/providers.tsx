"use client";
import { store } from "@/store";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import SupabaseProvider from "./supabase-provider";
import { QueryClientProvider, QueryClient } from "react-query";

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseProvider>
        <Provider store={store}>
          <CacheProvider prepend={false}>
            <Toaster />
            <ChakraProvider>{children}</ChakraProvider>
          </CacheProvider>
        </Provider>
      </SupabaseProvider>
    </QueryClientProvider>
  );
}
