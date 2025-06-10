import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { NuqsAdapter } from "nuqs/adapters/next/app";

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
    <html suppressHydrationWarning>
      <body className={`${inter.className} overflow-hidden h-screen w-[100vw]`}>
        <NuqsAdapter>
          <Providers>{children}</Providers>
        </NuqsAdapter>
      </body>
    </html>
  );
}
