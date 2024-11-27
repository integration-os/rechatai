import { mutation as rawMutation, internalMutation as rawInternalMutation } from "./_generated/server";
import { DataModel } from "./_generated/dataModel";
import { Triggers } from "convex-helpers/server/triggers";
import { customCtx, customMutation } from "convex-helpers/server/customFunctions";
import { internal } from "./_generated/api";

const triggers = new Triggers<DataModel>();

triggers.register("connections", async (ctx, change) => {
  if (change.operation === "insert") {
    const identity = await ctx.auth.getUserIdentity();
    
    if (identity) {
      await ctx.scheduler.runAfter(
        0, 
        internal.actions.trackSegmentEvent, 
        {
          userId: identity.subject,
          event: "Created Connection",
          properties: change.newDoc
        }
      );
    }
  }
});

triggers.register("apps", async (ctx, change) => {

  const identity = await ctx.auth.getUserIdentity();

  if (change.operation === "insert") {

    // Remove the code from properties before sending to segment
    const { code, ...properties } = change.newDoc;

    if (identity) {
      await ctx.scheduler.runAfter(
        0, 
        internal.actions.trackSegmentEvent, 
        {
          userId: identity.subject,
          event: "Created App",
          properties: properties,
        }
      );
    }
  }

});

triggers.register("users", async (ctx, change) => {

  const identity = await ctx.auth.getUserIdentity();

  if (change.operation === "insert") {
    if (identity) {
      await ctx.scheduler.runAfter(
        0, 
        internal.actions.trackIdentify, 
        {
          userId: identity.subject,
          traits: change.newDoc
        }
      );

      await ctx.scheduler.runAfter(
        0, 
        internal.actions.trackSegmentEvent, 
        {
          userId: identity.subject,
          event: "Created account",
          properties: change.newDoc
        }
      );

    }
  }

});

export const mutation = customMutation(rawMutation, customCtx(triggers.wrapDB));
export const internalMutation = customMutation(rawInternalMutation, customCtx(triggers.wrapDB));
