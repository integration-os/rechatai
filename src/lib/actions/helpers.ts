import { auth } from "@clerk/nextjs/server";


export async function ensureToken() {
  const { getToken } = auth();
  const token = await getToken({
    template: "convex",
  });

  if (token === null) {
    throw new Error("Unauthenticated call");
  }

  return token;
}

interface SessionContextKeyBuilder<T extends "data" | "integrationos-context"> {
  type: T;
  model: T extends "data" ? string : never;
  keyIdentifier: T extends "integrationos-context" ? "model-types" : never;
  platform: T extends "data" ? string : never;
  connectionKey: T extends "data" ? string : never;
}

type DataSessionContextKeyBuilder = Omit<
  SessionContextKeyBuilder<"data">,
  "keyIdentifier"
>;

type IntegrationOsContextKeyBuilder = Omit<
  SessionContextKeyBuilder<"integrationos-context">,
  "model" | "platform" | "connectionKey"
>;

type FinalSessionContextKeyBuilder =
  | DataSessionContextKeyBuilder
  | IntegrationOsContextKeyBuilder;

export const generateContextKey = (
  builder: FinalSessionContextKeyBuilder,
  id?: string
): string => {
  if (builder.type === "data") {
    const baseKey = `${builder.type}/${builder.platform.toLowerCase()}/${builder.model.toLowerCase()}/${builder.connectionKey}`;
    return id ? `${baseKey}/${id}` : baseKey;
  } else if (builder.type === "integrationos-context") {
    return `${builder.type}/${builder.keyIdentifier}`;
  }
  throw new Error("Invalid context key builder");
};

export async function retryAsync<T>(asyncFunc: () => Promise<T>, retries: number): Promise<T> {
  let attempt = 0;
  while (attempt < retries) {
      try {
          return await asyncFunc();
      } catch (error) {
          attempt++;
          if (attempt >= retries) {
              throw error;
          }
      }
  }
  // This point should not be reached
  throw new Error('Unexpected error in retryAsync function');
}