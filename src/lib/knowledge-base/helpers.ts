import { KnowledgeBase } from "../../types/knowledge-base";
import { Doc } from "../../../convex/_generated/dataModel";

export const processSessionContextForKnowledgeBase = (
  session?: Doc<"sessions">
): KnowledgeBase[] => {
  if (!session) {
    return [];
  }

  const context = session.context;

  let knowledgeBase: KnowledgeBase[] = [];

  if (!context || !context.length) {
    return [];
  }

  const platforms: {
    [platform: string]: {
      models: {
        name: string;
        rowsCount: number;
        lastUpdated: number;
        dataSnippet: string[]; // Add this line
      }[];
    };
  } = {};

  for (const ctx of context) {
    const { key, data, type, createdAt } = ctx;
    if (type === "data") {
      const [, platform, model] = key.split("/");
      if (!platforms[platform]) {
        platforms[platform] = {
          models: [],
        };
      }

      const unifiedData = data?.unified || data;
      const rowsCount = Array.isArray(unifiedData) ? unifiedData.length : 1;
      const dataSnippet = Array.isArray(unifiedData)
        ? unifiedData.slice(0, 3)
        : unifiedData;

      platforms[platform].models.push({
        name: model,
        rowsCount,
        lastUpdated: createdAt || 0,
        dataSnippet,
      });
    }
  }

  for (const platform in platforms) {
    knowledgeBase.push({
      id: platform,
      platform,
      models: platforms[platform].models,
    });
  }

  return knowledgeBase;
};
