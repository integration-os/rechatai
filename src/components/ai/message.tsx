"use client";

import { IconRechatAI, IconUser } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { StreamableValue } from "ai/rsc";
import { useStreamableText } from "@/lib/hooks/use-streamable-text";
import { spinner } from "../ui/spinner";
import { motion } from "framer-motion";
import { Markdown } from "../ui/markdown";
import { CircleX, RefreshCw } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

// Different types of message bubbles.

export function UserMessage({
  children,
  isLoading = false,
}: {
  children: React.ReactNode;
  isLoading?: boolean;
}) {
  const pulseVariants = {
    initial: { opacity: 0.3 },
    animate: { opacity: 0.8 },
    exit: { opacity: 1 },
  };

  const {user} = useUser();


  return (
    <div className="group relative flex items-start justify-start  first:mt-0">
      <div className="flex size-[30px] shrink-0 select-none items-center justify-center rounded-full border bg-background shadow-sm">
        {user?.imageUrl ? (
          <Image src={user.imageUrl} alt="User" width={30} height={30} className="rounded-full" />
        ) : (
          <IconUser />
        )}
      </div>
      <motion.div
        key={isLoading ? "loading" : "loaded"}
        className="relative px-5 "
        initial="initial"
        animate={isLoading ? "animate" : "exit"}
        exit="exit"
        variants={pulseVariants}
        transition={{
          duration: 0.8,
          repeat: isLoading ? Infinity : 0,
          repeatType: "reverse",
        }}
      >
        {typeof children === "string" ? (
          <Markdown content={children} />
        ) : (
          children
        )}
      </motion.div>
      

    </div>
  );
}

export function FailedMessage({
  children,
  errorMessage = "Failed to send.",
  onRetry,
}: {
  children: React.ReactNode;
  errorMessage?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="group relative flex items-start justify-end  my-5 first:mt-0">
      <div className="flex flex-col items-end w-full">
        <div className="relative max-w-[70%] rounded-3xl bg-muted px-5 py-2.5">
          {typeof children === "string" ? (
            <Markdown content={children} />
          ) : (
            children
          )}
        </div>
        <div className="mt-2 flex items-center text-xs text-red-500 max-w-[350px]">
          <CircleX className="w-6 h-6 mr-2 " />
          <p className="w-70%">{errorMessage} </p>
          <button
            onClick={onRetry}
            className="flex items-center ml-2 text-blue-500 hover:text-blue-600"
          >
            <span>Retry</span>
            <RefreshCw className="w-3 h-3 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function BotMessage({
  content,
  className,
}: {
  content: string | StreamableValue<string>;
  className?: string;
}) {
  const text = useStreamableText(content);

  return (
    <div className={cn("group relative flex items-start ", className)}>
      <div className="flex size-[30px] shrink-0 select-none items-center justify-center rounded-full border dark:bg-primary dark:text-primary-foreground light:bg-inherit light:text-inherit shadow-sm">
        <IconRechatAI />
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
        <Markdown content={text} />
      </div>
    </div>
  );
}

export function BotCard({
  children,
  showAvatar = true,
}: {
  children: React.ReactNode;
  showAvatar?: boolean;
}) {
  return (
    <div className="group relative flex items-start ">
      <div
        className={cn(
          "flex size-[30px] shrink-0 select-none items-center justify-center rounded-full border dark:bg-primary dark:text-primary-foreground light:bg-inherit light:text-inherit shadow-sm",
          !showAvatar && "invisible"
        )}
      >
        <IconRechatAI />
      </div>
      <div className="ml-4 flex-1 pl-2">{children}</div>
    </div>
  );
}

export function SystemMessage({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={
        "mt-2 flex items-center justify-center gap-2 text-xs text-gray-500"
      }
    >
      <div className={"max-w-[600px] flex-initial p-2"}>{children}</div>
    </div>
  );
}

export function SpinnerMessage() {
  return (
    <div className="group relative flex items-start ">
      <div className="flex size-[30px] shrink-0 select-none items-center justify-center rounded-full border bg-primary text-primary-foreground shadow-sm">
        <IconRechatAI />
      </div>
      <div className="ml-4 h-[24px] flex flex-row items-center flex-1 space-y-2 overflow-hidden px-1">
        {spinner}
      </div>
    </div>
  );
}
