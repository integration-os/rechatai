"use client";
import { Authenticated } from "convex/react";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Authenticated>{children}</Authenticated>
    </div>
  );
}
