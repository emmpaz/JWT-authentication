import type { Metadata } from "next";
import { Inconsolata } from "next/font/google";
import "./globals.css";
import ApolloWrapper from "./context/ApolloWrapper";

const incon = Inconsolata({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "auth",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="synthwave">
      <body className={incon.className}>
        <ApolloWrapper>
          {children}
        </ApolloWrapper>
      </body>
    </html>
  );
}
