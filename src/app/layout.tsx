// app/layout.tsx (RootLayout)
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Montserrat } from "next/font/google";
import QueryProvider from "@/components/providers/query-provider";
import AuthProvider from "@/components/providers/auth-provider";
import "./globals.css";
import React from "react";




const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["100","200","300","400","500","600","700","800","900"],
  display: "swap",
});


export const metadata: Metadata = {
  title: "jira",
  description: "jira",
  icons: { icon: "/c6b885d4b2b859ec4d0620df05d36a.png" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={` ${montserrat.variable} antialiased`}
    >
      <body>
        <AuthProvider>
          <QueryProvider>
            <React.Suspense fallback={<div>Loading...</div>}>
              {children}
            </React.Suspense>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
