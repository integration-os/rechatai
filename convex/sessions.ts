import { mutation, query, MutationCtx, QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { ensureAuth } from "./helpers";
import { generateId } from "../src/lib/helpers";

export const createSession = mutation({
  args: {
    messages: v.array(v.any()),
    title: v.optional(v.string()),
    organizationId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ensureAuth(ctx);

    const sessionId = await ctx.db.insert("sessions", {
      key: generateId("session"),
      messages: args.messages,
      title: args.title,
      ownerId: identity.tokenIdentifier,
      organizationId: args.organizationId,
    });

    return sessionId;
  },
});

export const updateSession = mutation({
  args: {
    id: v.id("sessions"),
    messages: v.array(v.any()),
  },
  handler: async (ctx, args) => {
    // This function only gets called from a server action that is already protected
    // await ensureAuth(ctx);

    console.log("Updating session", args.id, args.messages.length);

    const sessionId = await ctx.db.patch(args.id, { messages: args.messages });

    return sessionId;
  },
});

export const updateSessionTitle = mutation({
  args: {
    id: v.id("sessions"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    await ensureAuth(ctx);

    const sessionId = await ctx.db.patch(args.id, { title: args.title });

    return sessionId;
  },
});

export const updateSessionUsage = mutation({
  args: {
    id: v.id("sessions"),
    totalTokens: v.number(),
  },
  handler: async (ctx, args) => {
    await ensureAuth(ctx);

    const sessionId = await ctx.db.patch(args.id, { usage: {
      totalTokens: args.totalTokens,
    } });

    return sessionId;
  },
});

export const addOrUpdateKeyToSessionContext = mutation({
  args: {
    id: v.id("sessions"),
    key: v.string(),
    type: v.union(v.literal("data"), v.literal("integrationos-context")),
    data: v.any(),
  },
  handler: async (ctx, args) => {
    const identity = await ensureAuth(ctx);

    const session = await ctx.db.get(args.id);

    if (!session || (session.ownerId !== identity.tokenIdentifier && session.organizationId !== identity.org_id)) {
      throw new Error("Session not found or you don't have permission to edit it");
    }

    const context = session.context || [];

    const updatedContext = [
      ...context.filter((item) => item.key !== args.key),
      { key: args.key, type: args.type, data: args.data, createdAt: Date.now() },
    ];

    await ctx.db.patch(args.id, { context: updatedContext });

    return args.id;
  },
});

export const getSessionById = query({
  args: { id: v.id("sessions") },
  handler: async (ctx, args) => {
    const identity = await ensureAuth(ctx);

    const session = await ctx.db.get(args.id);

    if (!session || (session.ownerId !== identity.tokenIdentifier && session.organizationId !== identity.org_id)) {
      throw new Error(
        "Session not found or you don't have permission to access it"
      );
    }

    return session;
  },
});

export const listSessions = query({
  handler: async (ctx) => {
    const identity = await ensureAuth(ctx);
    
    let sessions = null;

      if (identity.org_id) {
        sessions = await ctx.db
          .query("sessions")
          .order("desc")
          .filter((q) => 
            q.and(
              q.eq(q.field("organizationId"), identity.org_id),
              q.or(
                q.eq(q.field("isDeleted"), false),
                q.eq(q.field("isDeleted"), undefined)
              )
            )
          )
          .paginate({ numItems: 100, cursor: null });
      } else {
        sessions = await ctx.db
          .query("sessions")
          .order("desc")
          .filter((q) => 
            q.and(
              q.eq(q.field("ownerId"), identity.tokenIdentifier),
              q.eq(q.field("organizationId"), undefined),
              q.or(
                q.eq(q.field("isDeleted"), false),
                q.eq(q.field("isDeleted"), undefined)
              )
            )
          )
          .paginate({ numItems: 100, cursor: null });
      }




    const withTitle = sessions.page.filter((session) => session.title);

    return {
      ...sessions,
      page: withTitle,
    };
  },
});

export const removeSession = mutation({
  args: {
    id: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    const identity = await ensureAuth(ctx);

    const existingSession = await ctx.db.get(args.id);
    if (
      !existingSession ||
      (existingSession.ownerId !== identity.tokenIdentifier && existingSession.organizationId !== identity.org_id)
    ) {
      throw new Error(
        "Session not found or you don't have permission to remove it"
      );
    }

    await ctx.db.patch(args.id, { isDeleted: true });
  },
});
