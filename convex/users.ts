import { query } from './_generated/server';
import { v } from "convex/values";
import { mutation } from './functions';

export const storeUser = mutation({
  args: { id: v.string(), email: v.string(), name: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("id"), args.id))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        email: args.email,
        name: args.name,
      });
    } else {
      await ctx.db.insert("users", args);
    }
  },
});

export const getUserById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("id"), args.id))
      .first();

    return user || null;
  },
});