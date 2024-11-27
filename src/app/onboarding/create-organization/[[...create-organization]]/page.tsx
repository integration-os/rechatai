"use client";

import Image from "next/image";
import { CreateOrganization } from "@clerk/nextjs";

export default function Organization(): JSX.Element {

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-8 relative overflow-hidden bg-gradient-to-r dark:bg-gradient-to-b dark:from-gray-950 dark:to-gray-900">
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
            Create an organization
          </h1>
          <a
            target="_blank"
            href="https://hub.rechatai.com/key-concepts/connections"
            className="block text-gray-600 dark:text-gray-400 text-sm underline"
          >
            What is an organization?
          </a>
        </div>
        <div className="mt-5 w-full flex justify-center">
          <CreateOrganization
            afterCreateOrganizationUrl={"/onboarding/pricing"}
            
          />
        </div>
      </div>
    </div>
  );
}
