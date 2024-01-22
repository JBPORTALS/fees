import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { ToastProvider } from "@chakra-ui/react";

const inter = Inter({ subsets: ["greek"] });

export const metadata = {
  title: "Nexus | Fee Master",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} overflow-hidden h-[100vh] w-[100vw]`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
