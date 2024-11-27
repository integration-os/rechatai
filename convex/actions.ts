import { v } from "convex/values";
import Analytics from "@segment/analytics-node";
import { internalAction } from "./_generated/server";

export const trackSegmentEvent = internalAction({
  args: {
    userId: v.string(),
    event: v.string(),
    properties: v.any()
  },
  handler: async (ctx, args) => {
    const analytics = new Analytics({
      writeKey: process.env.SEGMENT_WRITE_KEY!
    });

    await analytics.track({
      userId: args.userId,
      event: args.event,
      properties: args.properties
    });

    await analytics.closeAndFlush();
  },
});

export const trackIdentify = internalAction({
  args: {
    userId: v.string(),
    traits: v.any()
  },
  handler: async (ctx, args) => {
    const analytics = new Analytics({
      writeKey: process.env.SEGMENT_WRITE_KEY!
    });

    await analytics.identify({
      userId: args.userId,
      traits: args.traits
    });

    await analytics.closeAndFlush();
  },
});