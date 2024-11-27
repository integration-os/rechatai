import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { ensureToken } from "./helpers";

import { fetchMutation, fetchQuery } from "convex/nextjs";

export async function createInitialApp({
  title,
  description,
  code,
  prompt,
  platformsUsed,
  organizationId,
}: {
  title: string;
  description: string;
  code: string;
  prompt: string;
  platformsUsed: {
    platform: string;
    connectionKey: string;
    models: string[];
  }[];
  organizationId?: string;
}) {
  const token = await ensureToken();

  return await fetchMutation(
    api.appVersions.createAppVersion,
    {
      title,
      description,
      code,
      prompt,
      platformsUsed,
      organizationId,
      name: title.toLowerCase().replace(/\s/g, "-"),
      version: "1",
    },
    { token }
  );
}

export async function createNewAppVersion({
  appId,
  userMessage,
  aiExplanation,
  platformsUsed,
  code,
  organizationId,
}: {
  appId: Id<"apps">;
  userMessage: string;
  aiExplanation: string;
  platformsUsed: {
    platform: string;
    connectionKey: string;
    models: string[];
  }[];
  code: string;
  organizationId?: string;
}) {
  const token = await ensureToken();

  const currentApp = await fetchQuery(
    api.appVersions.getLatestAppVersion,
    {
      appId,
    },
    { token }
  );

  if (!currentApp) {
    throw new Error("Current app not found");
  }

  return await fetchMutation(
    api.appVersions.createAppVersion,
    {
      appId,
      userMessage,
      aiExplanation,
      platformsUsed,
      code,
      prompt: currentApp.prompt,
      name: currentApp.name,
      organizationId,
      version: (parseInt(currentApp.version) + 1).toString(),
    },
    { token }
  );
}
