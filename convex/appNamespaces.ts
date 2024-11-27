import { mutation, query, MutationCtx, QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { ensureAuth } from "./helpers";


export const createAppNamespace = mutation({
  args: {
    namespace: v.string(),
    name: v.string(),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ensureAuth(ctx);

    const namespaceId = await ctx.db.insert("appNamespaces", {
      namespace: args.namespace,
      name: args.name,
      title: args.title,
      description: args.description,
      ownerId: identity.tokenIdentifier,
    });

    return namespaceId;
  },
});

export const updateAppNamespace = mutation({
  args: {
    id: v.id("appNamespaces"),
    name: v.optional(v.string()),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ensureAuth(ctx);

    const existingNamespace = await ctx.db.get(args.id);
    if (!existingNamespace || existingNamespace.ownerId !== identity.tokenIdentifier) {
      throw new Error("Namespace not found or you don't have permission to update it");
    }

    const updateData: Partial<{
      name: string;
      title: string | undefined;
      description: string | undefined;
    }> = {};

    if (args.name !== undefined) updateData.name = args.name;
    if (args.title !== undefined) updateData.title = args.title;
    if (args.description !== undefined) updateData.description = args.description;

    const namespaceId = await ctx.db.patch(args.id, updateData);

    return namespaceId;
  },
});

export const listAppNamespaces = query({
  handler: async (ctx) => {
    const identity = await ensureAuth(ctx);

    const namespaces = await ctx.db
      .query("appNamespaces")
      .filter((q) => q.eq(q.field("ownerId"), identity.tokenIdentifier))
      .order("desc")
      .collect();

    return namespaces;
  },
});

export const removeAppNamespace = mutation({
  args: {
    id: v.id("appNamespaces"),
  },
  handler: async (ctx, args) => {
    const identity = await ensureAuth(ctx);

    const existingNamespace = await ctx.db.get(args.id);
    if (!existingNamespace || existingNamespace.ownerId !== identity.tokenIdentifier) {
      throw new Error("Namespace not found or you don't have permission to remove it");
    }

    await ctx.db.delete(args.id);
  },
});