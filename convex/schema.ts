import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    id: v.string(),
    email: v.string(),
    name: v.string(),
  }),
  // Add client table, make billing object optional
  clients: defineTable({
    ownerId: v.optional(v.string()),
    organizationId: v.optional(v.string()),
    billing: v.optional(
      v.object({
        provider: v.string(),
        customerId: v.string(),
        subscription: v.object({
          id: v.string(),
          endDate: v.number(),
          valid: v.boolean(),
          key: v.string(),
          reason: v.optional(v.string()),
        }),
      })
    ),
  }),
  sessions: defineTable({
    key: v.string(),
    isDeleted: v.optional(v.boolean()),
    messages: v.array(v.any()),
    title: v.optional(v.string()),
    context: v.optional(
      v.array(
        v.object({
          key: v.string(),
          type: v.union(v.literal("data"), v.literal("integrationos-context")),
          data: v.any(),
          createdAt: v.optional(v.number()),
        })
      )
    ),
    ownerId: v.optional(v.string()),
    organizationId: v.optional(v.string()),
    usage: v.optional(
      v.object({
        totalTokens: v.number(),
      })
    ),
  }),
  appNamespaces: defineTable({
    namespace: v.string(),
    name: v.string(),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    ownerId: v.optional(v.string()),
  }),
  apps: defineTable({
    namespace: v.string(),
    ownerId: v.optional(v.string()),
    organizationId: v.optional(v.string()),
    name: v.string(),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    prompt: v.string(),
    code: v.string(),
    version: v.optional(v.string()),
    platformsUsed: v.optional(
      v.array(
        v.object({
          platform: v.string(),
          connectionKey: v.string(),
          models: v.array(v.string()),
        })
      )
    ),
    isPublic: v.optional(v.boolean()),
    isVisible: v.optional(v.boolean()),
    isDeleted: v.optional(v.boolean()),
  }),
  appTemplates: defineTable({
    name: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    image: v.string(),
    category: v.string(),
    prompt: v.string(),
    code: v.string(),
    platformsUsed: v.optional(
      v.array(
        v.object({
          platform: v.string(),
          connectionKey: v.string(),
          models: v.array(v.string()),
        })
      )
    ),
  }),
  connections: defineTable({
    userId: v.string(),
    key: v.string(),
    platform: v.string(),
    ownerId: v.optional(v.string()),
    organizationId: v.optional(v.string()),
  }),
  appVersions: defineTable({
    appId: v.id("apps"),
    changes: v.optional(v.string()),
    code: v.string(),
    ownerId: v.string(),
    organizationId: v.optional(v.string()),
    description: v.optional(v.string()),
    isLatest: v.boolean(),
    name: v.string(),
    prompt: v.string(),
    userMessage: v.optional(v.string()),
    aiExplanation: v.optional(v.string()),
    platformsUsed: v.optional(
      v.array(
        v.object({
          platform: v.string(),
          connectionKey: v.string(),
          models: v.array(v.string()),
        })
      )
    ),
    title: v.optional(v.string()),
    version: v.string(),
  }),
});
