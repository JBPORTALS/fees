"use client";
import { store } from "@/store";
import { Provider } from "react-redux";
import { QueryClientProvider, QueryClient } from "react-query";
import TRPCProvider from "@/utils/trpc-provider";
import { Provider as ChakraProvider } from "@/components/ui/provider";
import { Toaster } from "@/components/ui/toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  return (
    <TRPCProvider>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <ChakraProvider>
            <Toaster />
            {children}
          </ChakraProvider>
        </Provider>
      </QueryClientProvider>
    </TRPCProvider>
  );
}
