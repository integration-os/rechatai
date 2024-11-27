import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import axios from "axios";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Handle OPTIONS requests
export async function OPTIONS(req: NextRequest) {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Handle POST requests
export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();

    if (user) {
      const settings = await axios.post(
        `${process.env.API_BASE_URL}/internal/v1/settings/get`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "X-Buildable-Secret": process.env.INTEGRATIONOS_API_KEY,
          },
        }
      );

      const connectionDefinitionUrl = `${process.env.API_BASE_URL}/v1/public/connection-definitions`;

      const connectionDefinitions = await axios.get(
        `${connectionDefinitionUrl}?limit=100&skip=0`
      );

      const isLiveSecret = (
        process.env.INTEGRATIONOS_API_KEY as string
      ).includes("sk_live");

      const activeConnectionDefinitionsData =
        connectionDefinitions?.data?.rows?.filter(
          (definition: any) => definition?.active
        );

      const connectedPlatforms = settings?.data?.connectedPlatforms?.filter(
        (platform: any) => {
          return (
            activeConnectionDefinitionsData?.find(
              (definition: any) =>
                definition?._id === platform?.connectionDefinitionId
            ) && platform?.active
          );
        }
      );

      const connectedPlatformsFiltered = connectedPlatforms?.filter(
        (platform: any) =>
          isLiveSecret
            ? platform?.environment === "live"
            : platform?.environment === "test" || !platform?.environment
      );

      return NextResponse.json(connectedPlatformsFiltered, {
        headers: corsHeaders,
      });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Some error occurred ....." },
      {
        status: 400, // Internal Server Error
        headers: corsHeaders,
      }
    );
  }
}
