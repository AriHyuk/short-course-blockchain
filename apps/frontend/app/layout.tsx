import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ContextProvider from '@/context' // Pastikan ini mengarah ke folder context yang baru
import { headers } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Avalanche Day 3",
  description: "Dapp Frontend Implementation",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Ambil cookies biar Reown ingat status login wallet
  const headersData = await headers();
  const cookies = headersData.get('cookie');

  return (
    // 👇 INI TAG YANG HILANG TADI
    <html lang="en">
      <body className={inter.className}>
        <ContextProvider cookies={cookies}>
          {children}
        </ContextProvider>
      </body>
    </html>
  );
}