import type { Metadata } from "next";
import QueryProvider from "../providers/QueryProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "RegiNexus Frontend",
  description:
    "Frontend-only RegiNexus demo for event registration and check-in on Zoho Catalyst.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
