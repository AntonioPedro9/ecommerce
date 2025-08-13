import "./globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";

import { Header } from "@/components/common/header";
import { db } from "@/db";
import ReactQueryProvider from "@/providers/react-query";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BEWEAR",
  description: "Cloth ecommerce",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const categories = await db.query.categoryTable.findMany({});
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ReactQueryProvider>
          <Header categories={categories} />
          {children}
        </ReactQueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
