"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface EmptyScreenProps {
  className?: string;
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
}

export function EmptyScreen({
  className,
  title,
  subtitle,
  showLogo = true,
}: EmptyScreenProps) {
  const { user } = useUser();
  const { theme } = useTheme();
  const userName = user?.firstName || "there";

  const defaultTitle = `What can I help you ship, ${userName}?`;
  const defaultSubtitle = "Generate admin panels, Gen AI apps, SQL dashboards, and much more.";

  return (
    <div className={cn(
      "relative flex h-[60vh] flex-col items-center justify-center text-center overflow-hidden",
      className
    )}>
      <div className="flex items-center mb-4">
        {showLogo && (
          <Image
            src={`/rechat-icon-${theme === "dark" ? "light" : "dark"}.svg`}
            alt="Rechat Logo"
            width={40}
            height={40}
            className="mr-3"
          />
        )}

        <h1 className="text-3xl font-bold">{title || defaultTitle}</h1>
      </div>
      <p className="mb-2 text-muted-foreground">
        {subtitle || defaultSubtitle}
      </p>
     
      <div className="absolute inset-0 ">
        <div className="absolute inset-0 bg-gradient-radial from-background/5 to-background/80 rounded-2xl p-10" />
      </div>
    </div>
  )
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}
