import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ensureAuth } from "./helpers";

export const listAppTemplates = query({
  handler: async (ctx) => {
    
    await ensureAuth(ctx);

    const appTemplates = await ctx.db.query("appTemplates").collect();
    return appTemplates;
  },
});

export const storeAppTemplate = mutation({
  args: {
    category: v.string(),
    title: v.string(),
    code: v.string(),
    description: v.optional(v.string()),
    image: v.string(),
    platformsUsed: v.optional(
      v.array(
        v.object({
          platform: v.string(),
          connectionKey: v.string(),
          models: v.array(v.string()),
        })
      )
    ),
    prompt: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {

    await ensureAuth(ctx);

    const payload = {
      ...args,
    };

    await ctx.db.insert("appTemplates", payload);
  },
});
