"use server";

import { fetchQuery, fetchMutation } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { ensureToken } from "./helpers";

export async function createSession({
  messages,
  title,
  organizationId
}: {
  messages: any[];
  title?: string;
  organizationId?: string;
}) {
  const token = await ensureToken();

  return fetchMutation(
    api.sessions.createSession,
    {
      messages,
      title,
      organizationId,
    },
    { token }
  );
}

export async function updateSession(id: Id<"sessions">, messages: any[]) {
  const token = await ensureToken();
  return fetchMutation(
    api.sessions.updateSession,
    {
      id,
      messages,
    },
    { token }
  );
}

export async function updateSessionTitle(
  token: string,
  id: Id<"sessions">,
  title: string
) {
  return fetchMutation(
    api.sessions.updateSessionTitle,
    {
      id,
      title,
    },
    { token }
  );
}

export async function updateSessionUsage(
  id: Id<"sessions">,
  totalTokens: number
) {
  const token = await ensureToken();
  return fetchMutation(
    api.sessions.updateSessionUsage,
    {
      id,
      totalTokens,
    },
    { token }
  );
}

export async function addOrUpdateKeyToSessionContext(
  id: Id<"sessions">,
  key: string,
  type: "data" | "integrationos-context",
  data: any
) {
  const token = await ensureToken();
  return fetchMutation(
    api.sessions.addOrUpdateKeyToSessionContext,
    {
      id,
      key,
      type,
      data,
    },
    { token }
  );
}

export async function getSessionById(id: Id<"sessions">) {
  const token = await ensureToken();
  return fetchQuery(api.sessions.getSessionById, { id }, { token });
}

export async function listSessions(token: string) {
  return fetchQuery(api.sessions.listSessions, {}, { token });
}

export async function removeSession(token: string, id: Id<"sessions">) {
  return fetchMutation(
    api.sessions.removeSession,
    {
      id,
    },
    { token }
  );
}
