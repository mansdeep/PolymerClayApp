import type { Metadata } from "next";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Polymer Clay Inspo",
  description:
    "Searchable reference of polymer clay projects, techniques, and finishing options.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body className="min-h-screen">
        <NavBar user={user} />
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
