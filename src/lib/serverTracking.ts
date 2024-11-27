import { Analytics } from "@segment/analytics-node";

let analytics: Analytics | null = null;

export function initializeServerAnalytics() {
  if (!analytics) {
    analytics = new Analytics({
      writeKey: process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY as string,
    });
  }
}

export async function trackServerEvent(
  event: string,
  userId: string | undefined,
  properties = {}
) {
  if (!analytics) {
    console.warn("Server-side analytics not initialized");
    return;
  }

  if (!userId) {
    console.warn("User not available for tracking");
    return;
  }

  analytics.track({
    event,
    userId,
    properties: {
      ...properties,
      version: "rechat-server-1.0.0",
    },
  });
}
