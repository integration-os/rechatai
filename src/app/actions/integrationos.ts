import { currentUser } from "@clerk/nextjs/server";
import { api, devDomain, domain } from "../../endpoints";
import { api as convexApi } from "../../../convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
import { resolve } from "path";
// load .env variables
require("dotenv").config({ path: resolve(__dirname, ".env.local") });

const convex = new ConvexHttpClient(
  process.env.NEXT_PUBLIC_CONVEX_URL as string || "https://mild-sandpiper-54.convex.cloud",
);

const raiseIfNotAuthenticated = async () => {
  const user = await currentUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  return user;
};

export const getModels = async (platform: string) => {
  const data = await api({
    method: "GET",
    url: `${domain}/public/connection-data/models/${platform}`,
  });

  return data;
};

export const getPlatformDetails = async (platform: string, model: string) => {
  const data = await api({
    method: "GET",
    url: `${domain}/public/connection-data/${model}/${platform}`,
  });

  return data;
};

interface CommonModelProjectionResponse {
  rows: { _id: string; name: string }[];
  total: number;
  skip: number;
  limit: number;
}

export const getAllCommonModels = async () => {
  const data: CommonModelProjectionResponse = await api({
    method: "GET",
    url: `${domain}/public/schemas/projection`,
  });

  return data;
};

export const getCommonModelTypes = async (
  model: string,
  language: "typescript" | "rust" = "typescript"
) => {
  const allModels = await getAllCommonModels();

  const commonModelId = allModels.rows.find(
    (cm) => cm.name.toLowerCase() === model.toLowerCase()
  )?._id;

  if (!commonModelId) {
    throw new Error("Common Model not found");
  }

  const data: string = await api({
    method: "GET",
    url: `${domain}/public/schemas/types/${commonModelId}/${language}`,
  });

  return data;
};

export const getManyCommonModelTypes = async (
  models: string[],
  language: "typescript" | "rust" = "typescript"
) => {
  const uniqueModelsSet = new Set(models);
  const uniqueModels = Array.from(uniqueModelsSet);

  let data = [];
  for (const commonModel of uniqueModels) {
    try {
      const types = await getCommonModelTypes(commonModel, language);
      data.push({
        model: commonModel,
        types,
      });
    } catch (e) {
      data.push({
        model: commonModel,
        types: `
        interface ${commonModel} {
          // Model not found, use your best judgement
        }
        `,
      });
    }
  }

  return data;
};

export const getUniqueModelTypes = async (
  models: string[],
  language: "typescript" | "rust" = "typescript"
): Promise<string> => {
  try {
    const data: string = await api({
      method: "GET",
      url: `${devDomain}/public/schemas/types/${language}/only/${models.join(",")}`
    });
    return data;
  } catch (error) {
    console.error("Error fetching unique model types:", error);
    return "";
  }
};
