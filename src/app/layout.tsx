import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import SupabaseProvider from "./supabase-provider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <SupabaseProvider>
        <Providers>{children}</Providers>
      </SupabaseProvider>
      </body>
    </html>
  );
}