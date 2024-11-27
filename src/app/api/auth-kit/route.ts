import { NextRequest, NextResponse } from "next/server";
import { AuthKitToken } from "@integrationos/authkit-node";
import { currentUser, auth } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from 'uuid';
import { nanoid } from "../../../lib/utils";
import { group } from "console";


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
export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();

    const { orgId } = await auth();

    let token = null;

    const key = process.env?.INTEGRATIONOS_API_KEY;

    const embedToken = new AuthKitToken(key || "");
    


    if (user) {

      let group = `${user.id}/${nanoid(12)}`;

      if (orgId) group = orgId;

      token = await embedToken.create({
        group,
        label: user.id,
        identityType: orgId ? "organization" : "user",
      });
    }

    return NextResponse.json(token, {
      headers: corsHeaders,
    });
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
