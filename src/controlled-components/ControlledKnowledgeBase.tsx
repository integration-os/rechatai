"use client";
import { useState, useEffect } from "react";
import { KnowledgeBaseSection } from "../components/ai/knowledge-base-section";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { processSessionContextForKnowledgeBase } from "../lib/knowledge-base/helpers";

// Custom hook to observe URL changes
const useUrlChange = () => {
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.href);

    const observer = new MutationObserver(() => {
      setUrl(window.location.href);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return url;
};

export const ControlledKnowledgeBase = () => {
  const url = useUrlChange();
  
  const getSessionId = (urlString: string) => {
    try {
      const parsedUrl = new URL(urlString, window.location.origin);
      const pathSegments = parsedUrl.pathname.split("/").filter(Boolean);
      return pathSegments[0] === "chat" && pathSegments[1] ? pathSegments[1] : undefined;
    } catch (error) {
      console.error("Error parsing URL:", error);
      return undefined;
    }
  };

  const sessionId = getSessionId(url);

  const session = useQuery(
    api.sessions.getSessionById,
    sessionId ? { id: sessionId as Id<"sessions"> } : "skip"
  );

  const knowledgeBase = processSessionContextForKnowledgeBase(session);

  return (
    <KnowledgeBaseSection knowledgeBase={knowledgeBase} onRefresh={() => {}} />
  );
};
