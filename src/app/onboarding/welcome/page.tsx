'use client';

import { Button } from "@/components/ui/button";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import Image from "next/image";
import { api } from "../../../../convex/_generated/api";
import { Loader } from "lucide-react";

export default function HeroSection() {
  const { membership } = useOrganization();
  const { user } = useUser();
  const client = useQuery(
    api.clients.getClientByUserId,
    user ? { userId: user.id } : "skip"
  );

  return (
    <>
      {!client && (
        <section className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-r dark:bg-gradient-to-b dark:from-gray-950 dark:to-gray-900">
          <div className="flex flex-col items-center space-y-4 text-center">
            <Loader
              className="animate-spin text-gray-900 dark:text-gray-100"
              size={48}
            />
            <p className="text-[16px] text-gray-700 dark:text-gray-300">
              Loading...
            </p>
          </div>
        </section>
      )}
      {client && (
        <section className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-r dark:bg-gradient-to-b dark:from-gray-950 dark:to-gray-900">
          <div className="mb-8">
            <Image
              alt="Logo"
              width={200}
              height={60}
              className="dark:invert"
              src={`/rechat-logo-dark.svg`}
            />
          </div>
          <div className="container px-4 md:px-6 max-w-[1200px]">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-4">
                <h1 className="text-[24px] font-semibold text-gray-900 dark:text-gray-100">
                  Build internal tools, remarkably fast.
                </h1>
                <div>
                  <p className="mx-auto text-[16px] text-gray-700 dark:text-gray-300">
                    Use AI to build elegant internal apps and workflows
                  </p>
                  <p className="mx-auto text-[16px] text-gray-700 dark:text-gray-300">
                    Connect them to over 30+ systems, including APIs and databases.
                  </p>
                </div>
              </div>
              <div className="pt-6">
                <Button
                  onClick={() =>
                    membership?.id
                      ? (window.location.href = "/onboarding/connect")
                      : (window.location.href = "/onboarding/create-organization")
                  }
                  size="lg"
                  className="bg-gray-900 min-w-[300px] text-white hover:text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}