import React from "react";

import { cn } from "@/lib/utils";
import { ExternalLink } from "@/components/external-link";

export function FooterText({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "px-2 text-center text-xs leading-normal text-muted-foreground",
        className
      )}
      {...props}
    >
      Rechat is AI for Work. Your chats aren&apos;t used to train our models. Rechat can make mistakes.
    </p>
  );
}
