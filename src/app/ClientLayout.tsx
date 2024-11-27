"use client";

import { useEffect, useState } from "react";
import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "../components/theme-provider";
import { Toaster } from "sonner";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { ControlledUser } from "@/controlled-components/ControlledUser";
import { dark } from "@clerk/themes";
import { init } from '@fullstory/browser';


export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [theme, setTheme] = useState<"dark" | "light" | null>(null);

  useEffect(() => {
    setTheme(
      document.documentElement.classList.contains("dark") ? "dark" : "light"
    );
  }, []);

  useEffect(() => {
    init({orgId: "o-2235C9-na1"});
  }, [])

  const queryClient = new QueryClient();
  const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

  return (
    <ClerkProvider
      appearance={{
        baseTheme: theme === "dark" ? dark : undefined,
        layout: {
          termsPageUrl: "https://hub.rechatai.com/resources/legal/terms",
          privacyPageUrl: "https://hub.rechatai.com/resources/legal/privacy",
        }
      }}
    >
      <html lang="en" className={GeistSans.className}>
        <body>
          <QueryClientProvider client={queryClient}>
            <Toaster
              position="bottom-right"
              toastOptions={{
                className: "border border-border bg-background text-foreground",
                duration: 5000,
              }}
            />
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
                <ControlledUser />
                <main>{children}</main>
              </ConvexProviderWithClerk>
            </ThemeProvider>
          </QueryClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
