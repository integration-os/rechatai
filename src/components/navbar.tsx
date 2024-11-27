"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { OrganizationSwitcher, useClerk, UserButton } from "@clerk/nextjs";
import { ModeToggle } from "./ui/theme-mode-toggle";
import { CreditCard, LogOut, NotebookText, Users } from "lucide-react";
import { ControlledBillingSection } from "@/controlled-components/settings/ControlledBillingSection";
import { ControlledInvoicesSection } from "@/controlled-components/settings/ControlledInvoicesSection";
import { useTheme } from "next-themes";
import Image from 'next/image';
import useTracking from "@/hooks/useTracking";
import { trackingConsts } from "@/lib/tracking";

export default function NavbarComponent() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("chat");
  const { theme } = useTheme();
  const { signOut, openOrganizationProfile } = useClerk();

  useEffect(() => {
    const path = pathname?.split("/")[1];
    if (path) setActiveTab(path);
  }, [pathname]);

  return (
    <div className="w-full">
      <nav className="border-b">
        <div className="flex h-16 items-center px-4">
          <div className="flex items-center">
            <Image
              alt="Logo"
              width={120}
              height={120}
              className={theme === "dark" ? "h-5" : "h-6"}
              src={`/rechat-logo-${theme === "dark" ? "light" : "dark"}.svg`}
            />
            <OrganizationSwitcher appearance={{
              elements: {
                organizationPreviewMainIdentifier: {
                  color: "gray",
                },
                userPreviewMainIdentifier: {
                  color: "gray",
                },
                organizationSwitcherTriggerIcon: {
                  color: "gray",
                },

              }
            }} afterSelectOrganizationUrl="/" afterSelectPersonalUrl="/" afterCreateOrganizationUrl="/" afterLeaveOrganizationUrl="/"  />
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Link
              href="https://www.rechatai.com/use-cases"
              target="_blank"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Use Cases
            </Link>

            <Link
              href="https://join.slack.com/t/rechat-ai/shared_invite/zt-2qkj8a0sw-EXOgHn9z_rioa2sRiDWngQ"
              target="_blank"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Community
            </Link>

            <ModeToggle />
            <UserButton
              appearance={{
                elements: {
                  userButtonPopoverActionButton__signOut: "hidden",
                },
              }}
            >
              <UserButton.MenuItems>
              <UserButton.Action label="manageAccount" />
                <UserButton.Action
                  label="Manage organizations"
                  labelIcon={<Users size={14} />}
                  onClick={() => openOrganizationProfile({
                    afterLeaveOrganizationUrl: "/",
                    
                  })}
                />
                <UserButton.Action
                  label="Sign out"
                  labelIcon={<LogOut size={14} />}
                  onClick={() => {
                    window.location.href = "/sign-in";
                    signOut();
                  }}
                />
              </UserButton.MenuItems>
              <UserButton.UserProfilePage
                label="Billing"
                labelIcon={<CreditCard size={16} />}
                url="billing"
              >
                <ControlledBillingSection />
              </UserButton.UserProfilePage>
              <UserButton.UserProfilePage
                label="Invoices"
                labelIcon={<NotebookText size={16} />}
                url="invoices"
              >
                <ControlledInvoicesSection />
              </UserButton.UserProfilePage>
            </UserButton>
          </div>
        </div>
      </nav>
      <div className="flex pl-5 border-b">
      <Link
          href="/chat"
          className={`px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary ${
            activeTab === "chat" ? "border-b-2 border-primary text-primary" : ""
          }`}
        >
          Chat
        </Link>
        <Link
          href="/dashboard"
          className={`px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary ${
            activeTab === "dashboard" ? "border-b-2 border-primary text-primary" : ""
          }`}
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}