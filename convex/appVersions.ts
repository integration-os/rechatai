import { query } from "./_generated/server";
import { v } from "convex/values";
import { ensureAuth } from "./helpers";
import { Id } from "./_generated/dataModel";
import { fetchMutation } from "convex/nextjs";
import { api } from "./_generated/api";
import { mutation } from "./functions";

export const createAppVersion = mutation({
  args: {
    appId: v.optional(v.id("apps")),
    changes: v.optional(v.string()),
    code: v.string(),
    description: v.optional(v.string()),
    name: v.string(),
    prompt: v.string(),
    platformsUsed: v.optional(
      v.array(
        v.object({
          platform: v.string(),
          connectionKey: v.string(),
          models: v.array(v.string()),
        })
      )
    ),
    organizationId: v.optional(v.string()),
    title: v.optional(v.string()),
    version: v.string(),
    userMessage: v.optional(v.string()),
    aiExplanation: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ensureAuth(ctx);

    let appId: Id<"apps">;

    if (args.appId) {
      // Check if the user owns the existing app
      const app = await ctx.db.get(args.appId);
      if (!app || (app.ownerId !== identity.tokenIdentifier && app.organizationId !== identity.org_id)) {
        throw new Error(
          "App not found or you don't have permission to modify it"
        );
      }
      appId = args.appId;
    } else {
      // Create a new app
      console.log("Creating a new app >>>>>>>>");
      appId = await ctx.db.insert("apps", {
        name: args.name,
        code: args.code,
        prompt: args.prompt,
        title: args.title,
        description: args.description,
        platformsUsed: args.platformsUsed,
        organizationId: args.organizationId,
        namespace: "default",
        ownerId: identity.tokenIdentifier,
        isPublic: false,
        isVisible: true,
      });
    }
    console.log("App created >>>>>>>>", appId);

    await ctx.db
      .query("appVersions")
      .filter((q) =>
        q.and(q.eq(q.field("appId"), appId), q.eq(q.field("isLatest"), true))
      )
      .collect()
      .then((versions) => {
        versions.forEach((version) => {
          ctx.db.patch(version._id, { isLatest: false });
        });
      });

    const newVersionId = await ctx.db.insert("appVersions", {
      ...args,
      appId,
      ownerId: identity.tokenIdentifier,
      organizationId: args.organizationId,
      isLatest: true,
    });

    // Update app with new version
    await ctx.db.patch(appId, {
      version: args.version,
      code: args.code,
      platformsUsed: args.platformsUsed,
      prompt: args.prompt,
    });

    return { appId, versionId: newVersionId };
  },
});

export const getLatestAppVersion = query({
  args: { appId: v.id("apps") },
  handler: async (ctx, args) => {
    const identity = await ensureAuth(ctx);

    // Check if the user owns the app
    const app = await ctx.db.get(args.appId);
    if (!app || (app.ownerId !== identity.tokenIdentifier && app.organizationId !== identity.org_id)) {
      throw new Error(
        "App not found or you don't have permission to access it"
      );
    }

    const latestVersion = await ctx.db
      .query("appVersions")
      .filter((q) =>
        q.and(
          q.eq(q.field("appId"), args.appId),
          q.eq(q.field("isLatest"), true)
        )
      )
      .first();

    return latestVersion;
  },
});

export const listAppVersions = query({
  args: { appId: v.id("apps") },
  handler: async (ctx, args) => {
    const identity = await ensureAuth(ctx);

    // Check if the user owns the app
    const app = await ctx.db.get(args.appId);
    if (!app || (app.ownerId !== identity.tokenIdentifier && app.organizationId !== identity.org_id)) {
      throw new Error(
        "App not found or you don't have permission to access it"
      );
    }

    if (identity.org_id) {
      const versions = await ctx.db
        .query("appVersions")
        .filter((q) =>
          q.and(
            q.eq(q.field("appId"), args.appId),
            q.eq(q.field("organizationId"), identity.org_id)
          )
        )
        .order("desc")
        .collect();

      return versions;
    }

    const versions = await ctx.db
      .query("appVersions")
      .filter((q) => q.and(
        q.eq(q.field("appId"), args.appId),
        q.eq(q.field("organizationId"), undefined)
      ))
      .order("desc")
      .collect();

    return versions;
  },
});

export const setAppVersionAsLatest = mutation({
  args: { versionId: v.id("appVersions") },
  handler: async (ctx, args) => {
    const identity = await ensureAuth(ctx);

    const version = await ctx.db.get(args.versionId);
    if (!version) {
      throw new Error("Version not found");
    }

    // Check if the user owns the app
    const app = await ctx.db.get(version.appId);
    if (!app || (app.ownerId !== identity.tokenIdentifier && app.organizationId !== identity.org_id)) {
      throw new Error(
        "App not found or you don't have permission to modify it"
      );
    }

    // Set all versions of this app to not be latest
    await ctx.db
      .query("appVersions")
      .filter((q) => q.eq(q.field("appId"), version.appId))
      .collect()
      .then((versions) => {
        versions.forEach((v) => {
          ctx.db.patch(v._id, { isLatest: false });
        });
      });

    // Set the selected version as latest
    await ctx.db.patch(args.versionId, { isLatest: true });

    // Update the app with the new version
    await ctx.db.patch(version.appId as Id<"apps">, {
      version: version.version,
    });

    return args.versionId;
  },
});
