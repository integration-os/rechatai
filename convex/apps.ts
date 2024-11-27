import { v } from "convex/values";
import { query } from "./_generated/server";
import { ensureAuth } from "./helpers";
import { mutation } from "./functions";

export const createApp = mutation({
  args: {
    name: v.string(),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    prompt: v.optional(v.string()),
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
    isPublic: v.optional(v.boolean()),
    isVisible: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let identity = await ensureAuth(ctx);
    if (identity === null) {
      throw new Error("Unauthenticated call to mutation");
    }

    const appId = await ctx.db.insert("apps", {
      namespace: "default",
      ownerId: identity.tokenIdentifier,
      name: args.name,
      title: args.title,
      description: args.description,
      prompt: args.prompt || "",
      code: args.code,
      platformsUsed: args.platformsUsed,
      isPublic: args.isPublic ?? false,
      isVisible: args.isVisible ?? false,
      isDeleted: false,
    });

    return appId;
  },
});

export const getAppsByOwnerId = query({
  handler: async (ctx, args) => {
    const identity = await ensureAuth(ctx);

    if (identity.org_id) {
      return await ctx.db
        .query("apps")
        .filter(
          (q) =>
            q.and(
              q.eq(q.field("organizationId"), identity.org_id),
              q.or(
                q.eq(q.field("isDeleted"), false),
                q.eq(q.field("isDeleted"), undefined)
              ),
              q.or(
                q.eq(q.field("isVisible"), true),
                q.eq(q.field("isVisible"), undefined)
              )
            )
        )
        .order("desc")
        .collect();
    }

    return await ctx.db
      .query("apps")
      .filter(
        (q) =>
          q.and(
            q.eq(q.field("ownerId"), identity.tokenIdentifier),
            q.eq(q.field("organizationId"), undefined),
            q.or(
              q.eq(q.field("isDeleted"), false),
              q.eq(q.field("isDeleted"), undefined)
            ),
            q.or(
              q.eq(q.field("isVisible"), true),
              q.eq(q.field("isVisible"), undefined)
            )
          )
      )
      .order("desc")
      .collect();
  },
});

// Soft delete app
export const removeApp = mutation({
  args: {
    id: v.id("apps"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Unauthenticated call to mutation");
    }
    await ctx.db.patch(args.id, { isDeleted: true, isVisible: false });
    return args.id;
  },
});

// Update an existing app
export const updateApp = mutation({
  args: {
    id: v.id("apps"),
    name: v.optional(v.string()),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    prompt: v.optional(v.string()),
    code: v.optional(v.string()),
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
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Unauthenticated call to mutation");
    }

    const app = await ctx.db.get(args.id);
    if (!app) {
      throw new Error("App not found");
    }

    if ((app.ownerId !== identity.tokenIdentifier && app.organizationId !== identity.org_id)) {
      throw new Error("Unauthorized: You don't own this app");
    }

    const { id, ...updateArgs } = args;
    await ctx.db.patch(args.id, updateArgs);
    return args.id;
  },
});

// Get a single app by ID
export const getAppById = query({
  args: { id: v.id("apps") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const app = await ctx.db.get(args.id);

    if (!app) {
      throw new Error("App not found");
    }

    if (!app.isPublic && (!identity || (app.ownerId !== identity.tokenIdentifier && app.organizationId !== identity.org_id))) {
      throw new Error("Unauthorized: This app is private");
    }

    return app;
  },
});

// Get public apps
export const getPublicApp = query({
  args: {
    id: v.id("apps"),
  },
  handler: async (ctx, args) => {
    const app = await ctx.db.get(args.id);

    if (!app) {
      throw new Error("App not found");
    }

    if (!app.isPublic) {
      throw new Error("Unauthorized: This app is private");
    }

    return app;
  },
});
