import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ensureAuth } from "./helpers";

export const updateClient = mutation(
  async (
    { db },
    {
      customerId,
      billing,
    }: {
      customerId: string;
      billing: {
        provider: string;
        customerId: string;
        subscription: {
          id: string;
          endDate: number;
          valid: boolean;
          key: string;
          reason?: string;
        };
      };
    }
  ) => {
    const client = await db
      .query("clients")
      .filter((q) => q.eq(q.field("billing.customerId"), customerId))
      .first();

    if (client) {
      await db.patch(client._id, {
        billing: billing,
      });
    }
  }
);

export const storeClient = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {

    const identity = await ensureAuth(ctx);

    const payload = {
      ...args,
      ownerId: identity.tokenIdentifier,
    }

    const existing = await ctx.db
      .query("clients")
      .filter((q) => q.eq(q.field("ownerId"), identity.tokenIdentifier))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ownerId: identity.tokenIdentifier,
        billing: args.billing,
      });
    } else {
      await ctx.db.insert("clients", payload);
    }
  },
});

export const getClientByOwnerId = query({
  handler: async (ctx) => {

    const identity = await ensureAuth(ctx);

    return await ctx.db
      .query("clients")
      .filter((q) => q.eq(q.field("ownerId"), identity.tokenIdentifier))
      .first();
  },
});

export const getClientByCustomerId = query({
  args: { customerId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("clients")
      .filter((q) => q.eq(q.field("billing.customerId"), args.customerId))
      .first();
  },
});

export const updateClientOrganization = mutation({
  args: {
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ensureAuth(ctx);

    const client = await ctx.db
      .query("clients")
      .filter((q) => q.eq(q.field("ownerId"), identity.tokenIdentifier))
      .first();

    
    if (client) {
      await ctx.db.patch(client._id, {
        organizationId: args.organizationId,
      });
    }

  },
});

export const getClientByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const clients = await ctx.db.query("clients").collect();

    const matchingClient = clients.find((client) =>
      client.ownerId?.includes(args.userId)
    );

    return matchingClient || null;
  },
});