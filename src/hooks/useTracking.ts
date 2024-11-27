import { useUser } from "@clerk/nextjs";
import { AnalyticsBrowser } from "@segment/analytics-next";
import { useEffect, useRef } from "react";

const VERSION = "rechat-1.0.0";

let analyticsInstance: AnalyticsBrowser | null = null;

export default function useTracking() {
  const { user } = useUser();
  const analyticsRef = useRef<AnalyticsBrowser | null>(null);

  useEffect(() => {
    if (!analyticsInstance) {
      analyticsInstance = AnalyticsBrowser.load({
        writeKey: process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY as string,
      });
    }
    analyticsRef.current = analyticsInstance;
  }, []);

  function track(event: string, properties = {}) {
    if (analyticsRef.current && user) {
      analyticsRef.current.track(event, {
        userId: user.id,
        properties: {
          ...properties,
          version: VERSION,
        },
      });
    } else {
      console.warn("Analytics not initialized or user not available");
    }
  }

  function identifyUser() {
    if (analyticsRef.current && user) {
      analyticsRef.current.identify(user.id, user);
    } else {
      console.warn("Analytics not initialized or user not available");
    }
  }

  return {
    track,
    identifyUser,
  };
}