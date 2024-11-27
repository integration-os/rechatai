import { api, domain } from "@/endpoints";
import { NextRequest, NextResponse } from "next/server";
import {
  AllocationMethod,
  CustomerSelection,
  DiscountType,
  IntegrationOS,
  TargetSelection,
  TargetType,
} from "@integrationos/node";
import { auth, currentUser } from "@clerk/nextjs/server";
import { ensureToken } from "../../../lib/actions/helpers";
import _ from "lodash";
import { UnifiedResourceImpl } from "./types";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Add this function at the top of the file, after imports
async function authenticateAndValidateConnection(
  connectionKey: string | null
): Promise<NextResponse | null> {
  try {
    await ensureToken();
    const { userId, orgId } = auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        {
          status: 401,
          headers: corsHeaders,
        }
      );
    }

    if (!connectionKey) {
      return NextResponse.json(
        { error: "Connection key is required" },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    const kebabCaseUserId = _.kebabCase(userId);
    if (
      connectionKey.includes(userId) ||
      connectionKey.includes(kebabCaseUserId) ||
      (orgId && connectionKey.includes(orgId))

    ) {
      return null; // Authentication passed
    }

    return NextResponse.json(
      { error: "Invalid connection key" },
      {
        status: 403,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

// grab the model from the qp

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

const integrate = new IntegrationOS(
  process.env.INTEGRATIONOS_API_KEY as string
);

// Get one or more records
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const model = searchParams.get("model");
  const connectionKey = searchParams.get("connectionKey");
  const id = searchParams.get("id");

  const authResponse = await authenticateAndValidateConnection(connectionKey);
  if (authResponse) return authResponse;

  // get remaining query params
  const params = Object.fromEntries(searchParams.entries());
  const cleanedParams = Object.keys(params).reduce((acc, key) => {
    if (
      key !== "model" &&
      key !== "connectionKey" &&
      key !== "id" &&
      key !== "cursor" &&
      key !== "limit"
    ) {
      // @ts-ignore
      acc[key] = params[key];
    }
    return acc;
  }, {});

  if (!connectionKey) {
    return NextResponse.json(
      { error: "Connection key is required" },
      {
        status: 400,
        headers: corsHeaders,
      }
    );
  }
  const limit = searchParams.get("limit");
  let cursor = searchParams.get("cursor");

  const cursorObject =
    cursor === "0" || cursor === "undefined" || !cursor ? {} : { cursor };

  try {
    let data;
    const integrator =
      integrate[model?.toLowerCase() as keyof typeof integrate](connectionKey);

    if (id) {
      data = await integrator.get(id);
    } else {
      data = await integrator.list(
        {
          limit: limit ? parseInt(limit) : 10,
          ...cursorObject,
        },
        {
          passthroughQuery: {
            // location_ids: "LP2WE4488YN4S",
            ...cleanedParams,
          },
        }
      );
    }

    return NextResponse.json(data, {
      headers: corsHeaders,
    });
  } catch (error: any) {
    return NextResponse.json(error?.error || error.message || error, {
      status: 400,
      headers: corsHeaders,
    });
  }
}
// Create a new record
export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const model = searchParams.get("model");
  const connectionKey = searchParams.get("connectionKey");
  const query = searchParams.get("query");

  const authResponse = await authenticateAndValidateConnection(connectionKey);
  if (authResponse) return authResponse;

  try {
    const body = await req.json();
    if (!model || !connectionKey) {
      throw new Error("Model and connectionKey are required");
    }

    const integrator = integrate[model.toLowerCase() as keyof IntegrationOS](
      connectionKey
    ) as UnifiedResourceImpl<any>;
    const data = await integrator.create(body, {
      passthroughQuery: {
        query: query || "",
      },
    });

    return NextResponse.json(data, {
      headers: corsHeaders,
    });
  } catch (error: any) {
    console.log(JSON.stringify(error, null, 2), "<<<<<");
    return NextResponse.json(error?.error || error.message || error, {
      status: 400,
      headers: corsHeaders,
    });
  }
}
// Update a record
export async function PATCH(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const model = searchParams.get("model");
  const connectionKey = searchParams.get("connectionKey");
  const id = searchParams.get("id");

  const authResponse = await authenticateAndValidateConnection(connectionKey);
  if (authResponse) return authResponse;

  if (!model) {
    return NextResponse.json(
      { error: "Model is required" },
      {
        status: 400,
        headers: corsHeaders,
      }
    );
  }

  if (!id) {
    return NextResponse.json(
      { error: "ID is required" },
      {
        status: 400,
        headers: corsHeaders,
      }
    );
  }

  try {
    const body = await req.json();
    const data = await integrate[
      model?.toLowerCase() as keyof typeof integrate
    ](connectionKey!).update(id!, body);

    return NextResponse.json(data, {
      headers: corsHeaders,
    });
  } catch (error: any) {
    return NextResponse.json(error?.error || error.message || error, {
      status: 400,
      headers: corsHeaders,
    });
  }
}
// Delete a record
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const model = searchParams.get("model");
  const connectionKey = searchParams.get("connectionKey");
  const id = searchParams.get("id");

  const authResponse = await authenticateAndValidateConnection(connectionKey);
  if (authResponse) return authResponse;

  if (!model) {
    return NextResponse.json(
      { error: "Model is required" },
      {
        status: 400,
        headers: corsHeaders,
      }
    );
  }

  if (!id) {
    return NextResponse.json(
      { error: "ID is required" },
      {
        status: 400,
        headers: corsHeaders,
      }
    );
  }

  try {
    const data = await integrate[
      model?.toLowerCase() as keyof typeof integrate
    ](connectionKey!).delete(id!);

    return NextResponse.json(data, {
      headers: corsHeaders,
    });
  } catch (error: any) {
    return NextResponse.json(error?.error || error.message || error, {
      status: 400,
      headers: corsHeaders,
    });
  }
}
