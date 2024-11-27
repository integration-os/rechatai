import { query } from "./_generated/server";
import { v } from "convex/values";
import { ensureAuth } from "./helpers";
import { mutation } from "./functions";

export const storeConnection = mutation({
  args: {
    userId: v.string(),
    key: v.string(),
    platform: v.string(),
    organizationId: v.optional(v.string()),
    ownerId: v.string(),
  },
  handler: async (ctx, args) => {
    const payload = {
      ...args
    }

    const existing = await ctx.db
      .query("connections")
      .filter((q) => q.eq(q.field("key"), args.key))
      .first();
  

    if (!existing) {
      await ctx.db.insert("connections", payload);
    }
  },
});

export const listConnections = query({
  handler: async (ctx) => {
    const identity = await ensureAuth(ctx);

    if (identity.org_id) {
      const connections = await ctx.db
        .query("connections")
        .filter((q) => q.eq(q.field("organizationId"), identity.org_id))
        .collect();

      return connections;
    }

    const connections = await ctx.db
      .query("connections")
      .filter((q) => 
        q.and(
          q.eq(q.field("ownerId"), identity.tokenIdentifier),
          q.eq(q.field("organizationId"), undefined)
        )
      )
      .collect();

    return connections;

  }
});

export const listConnectionsByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const connections = await ctx.db
      .query("connections")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    return connections;
  }
});

export const deleteConnection = mutation({
  args: { _id: v.id("connections") },
  handler: async (ctx, args) => {

    const identity = await ensureAuth(ctx);

    const existingConnection = await ctx.db.get(args._id);

    if (
      !existingConnection ||
      (existingConnection.ownerId !== identity.tokenIdentifier && existingConnection.organizationId !== identity.org_id)
    ) {
      throw new Error("Connection not found or you don't have permission to access it");
    }

    await ctx.db.delete(args._id);
  },
});
