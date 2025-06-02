"use client";
import { store } from "@/store";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { QueryClientProvider, QueryClient } from "react-query";
import TRPCProvider from "@/utils/trpc-provider";
import { Provider as ChakraProvider } from "@/components/ui/provider";

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  return (
    <TRPCProvider>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <Toaster />
          <ChakraProvider>{children}</ChakraProvider>
        </Provider>
      </QueryClientProvider>
    </TRPCProvider>
  );
}
