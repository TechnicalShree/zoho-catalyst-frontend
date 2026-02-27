import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DoorFlow Frontend",
  description:
    "Frontend-only DoorFlow demo for event registration and check-in on Zoho Catalyst.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
