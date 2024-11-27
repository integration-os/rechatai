"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { TruncateText } from "@/components/ui/MiddleTruncate";

interface NavProps {
  isCollapsed?: boolean;
  links: {
    title: string;
    label?: string;
    icon?: LucideIcon;
    variant: "default" | "ghost";
    href: string;
    onClick?: () => void;
  }[];
}

export function Nav({ links, isCollapsed }: NavProps) {
  const pathname = usePathname();

  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-2 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) => {
          const isActive = pathname === link.href;
          
          return isCollapsed ? (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href={link.href}
                  className={cn(
                    buttonVariants({ variant: link.variant, size: "icon" }),
                    "h-8 w-8",
                    link.variant === "default" &&
                      "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white",
                    isActive && "bg-secondary text-secondary-foreground"
                  )}
                >
                  <span className="sr-only">{link.title}</span>
                  {link.icon && <link.icon className={cn("h-4 w-4", isActive ? "text-secondary-foreground" : "text-gray-500")} />}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {link.title}
                {link.label && (
                  <span className="ml-auto text-muted-foreground">
                    {link.label}
                  </span>
                )}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              key={index}
              href={link.href}
              className={cn(
                buttonVariants({ variant: link.variant, size: "sm" }),
                link.variant === "default" &&
                  "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "h-6 text-xs w-full flex items-center font-normal",
                isActive && "bg-secondary text-secondary-foreground"
              )}
            >
              <div className="flex-grow mr-2">
                <TruncateText text={link.title} maxLength={30} truncatePosition="end" />
              </div>
              <div className="flex items-center flex-shrink-0">
                {link.label && (
                  <span
                    className={cn(
                      "mr-2",
                      link.variant === "default" &&
                      "text-background dark:text-white"
                    )}
                  >
                    {link.label}
                  </span>
                )}
                {link.icon &&  <link.icon onClick={link.onClick} className={cn("h-4 w-4", isActive ? "text-secondary-foreground" : "text-gray-400")} />}
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
