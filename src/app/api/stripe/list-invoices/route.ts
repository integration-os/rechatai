import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
    const body = await req.json();

    const { customerId } = body;

    const invoices = await stripe.invoices.list({
        customer: customerId,
        limit: 100
    });

    return NextResponse.json(invoices, {
      headers: corsHeaders,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Some error occurred" },
      {
        status: 400,
        headers: corsHeaders,
      }
    );
  }
}
