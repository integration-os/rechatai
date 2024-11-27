"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { cn } from "@/lib/utils";
import Link from "next/link";

import DotPattern from "../../components/magicui/dot-pattern";
import { ControlledCodeEditorWithAI } from "../../controlled-components/controlled-code-editor-with-ai";
import { RainbowButton } from "../../components/magicui/rainbow-button";

const EmptyAppsState = () => (
  <div className="flex items-center justify-center flex-col h-[calc(100vh-105px)] gap-6 p-4 w-full">
    <div className="h-auto w-full flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-bold">Your app dashboard is empty</h1>
      <p className="my-2 text-muted-foreground">
        Ready to create your first app? Start with a prompt
      </p>
    </div>

    <Link href="/chat">
      <RainbowButton>Create an App</RainbowButton>
    </Link>

    <DotPattern
      width={12}
      height={12}
      className={cn(
        "[mask-image:radial-gradient(300px_circle_at_center,rgba(255,255,255,0.5),rgba(255,255,255,0.1))]"
      )}
    />
  </div>
);

export const DynamicApps = () => {
  const apps = useQuery(api.apps.getAppsByOwnerId, {});

  if (!apps || apps.length === 0) {
    return (
      <div className="w-full h-[calc(100vh-104px)] relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <EmptyAppsState />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 flex">
      <div
        className={`flex flex-col flex-grow transition-all duration-300 gap-4`}
      >
        {apps.map((app) => {
          return (
            <div
              key={app._id}
              id={`app-${app._id}`}
              className="w-full overflow-auto nowheel cursor-default"
              onWheel={(e) => e.stopPropagation()}
            >
              <ControlledCodeEditorWithAI appId={app._id} code={app.code} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
