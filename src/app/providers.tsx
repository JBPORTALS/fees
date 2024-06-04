"use client";
import { store } from "@/store";
import { CacheProvider } from "@chakra-ui/next-js";
import {
  ChakraProvider,
  ColorModeScript,
  ThemeConfig,
  extendTheme,
  localStorageManager,
} from "@chakra-ui/react";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { QueryClientProvider, QueryClient } from "react-query";
import TRPCProvider from "@/utils/trpc-provider";

const config: ThemeConfig = {
  initialColorMode: "dark", // 'dark' | 'light'
  useSystemColorMode: false,
};

const theme = extendTheme(config);

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  return (
    <TRPCProvider>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <CacheProvider prepend={false}>
            <Toaster />
            <ChakraProvider
              colorModeManager={localStorageManager}
              theme={theme}
            >
              <ColorModeScript initialColorMode={"dark"} />
              {children}
            </ChakraProvider>
          </CacheProvider>
        </Provider>
      </QueryClientProvider>
    </TRPCProvider>
  );
}
