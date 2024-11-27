"use client";

import Image from "next/image";
import { completeOnboarding } from "../_actions";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import AppsList from "@/components/connect-apps-list";

export default function ConnectionCreation(): JSX.Element {
  const { user } = useUser();
  const router = useRouter();

  const handleSkip = async () => {
    try {
      await completeOnboarding();
      await user?.reload();
      router.push("/chat");
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-start justify-start pt-8 relative overflow-hidden bg-gradient-to-r dark:bg-gradient-to-b dark:from-gray-950 dark:to-gray-900">
      {/* Logo */}
      <div className="w-full flex justify-center mb-20 z-10">
        <Image
          alt="Logo"
          width={120}
          height={40}
          className="dark:invert h-7 w-auto"
          src="/rechat-logo-dark.svg"
          priority
        />
      </div>

      {/* Main content */}
      <div className="z-10 w-full max-w-lg px-4 mx-auto text-center justify-center">
        <div className="text-center justify-center space-y-2">
          <h1 className="text-[24px] font-semibold text-center text-gray-900 dark:text-gray-100">
            Add a connection
          </h1>
          <a
          target="_blank"
            href="https://hub.rechatai.com/key-concepts/organization"
            className="block text-gray-600 dark:text-gray-400 text-sm underline"
          >
            What is a connection?
          </a>
        </div>
        <div className="mt-5">
          <AppsList />
        </div>
        <button
          onClick={handleSkip}
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mt-10"
        >
          {"I'll do this later"}
        </button>
      </div>
    </div>
  );
}
