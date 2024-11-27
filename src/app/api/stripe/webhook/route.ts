import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";
import {
  initializeServerAnalytics,
} from "@/lib/serverTracking";
import { trackingConsts } from "@/lib/tracking";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

  const sig = req.headers.get("stripe-signature") as string;

  const convex = new ConvexHttpClient(
    process.env.NEXT_PUBLIC_CONVEX_URL as string
  );

  initializeServerAnalytics();

  let event;
  try {
    const rawBody = await req.text();

    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);

    switch (event.type) {
      case "customer.subscription.updated":
        const updatedSubscription = event.data.object;

        const billing = {
          provider: "stripe",
          customerId: updatedSubscription.customer as string,
          subscription: {
            id: updatedSubscription.id,
            endDate: updatedSubscription.current_period_end,
            valid: true,
            key:
              (updatedSubscription as any)?.plan?.id ===
              process.env.STRIPE_FREE_PLAN_PRICE_ID
                ? "sub::free"
                : (updatedSubscription as any)?.plan?.id ===
                    process.env.STRIPE_BASIC_PLAN_PRICE_ID
                  ? "sub::basic"
                  : (updatedSubscription as any)?.plan?.id ===
                      process.env.STRIPE_TEAM_PLAN_PRICE_ID
                    ? "sub::team"
                    : (updatedSubscription as any)?.plan?.id ===
                        process.env.STRIPE_BUSINESS_PLAN_PRICE_ID
                      ? "sub::business"
                      : (updatedSubscription as any)?.plan?.id ===
                          process.env.STRIPE_PRO_PLAN_PRICE_ID
                        ? "sub::pro"
                        : (updatedSubscription as any)?.plan?.id ===
                            process.env.STRIPE_GROWTH_PLAN_PRICE_ID
                          ? "sub::growth"
                          : "sub::unknown",
          },
        };

        await convex.mutation(api.clients.updateClient, {
          billing,
          customerId: updatedSubscription?.customer as string,
        });

        const updatedSubscriptionClient = await convex.query(
          api.clients.getClientByCustomerId,
          {
            customerId: updatedSubscription?.customer as string,
          }
        );

        if (!updatedSubscriptionClient || !updatedSubscriptionClient?.ownerId) {
          return NextResponse.json(
            { error: "Client not found" },
            {
              status: 400,
              headers: corsHeaders,
            }
          );
        }

        return NextResponse.json(
          { message: "Subscription updated" },
          {
            status: 200,
            headers: corsHeaders,
          }
        );

      case "customer.subscription.deleted":
        const deletedSubscription = event.data.object;

        const subscriptionCreated = await stripe.subscriptions.create({
          customer: deletedSubscription?.customer as string,
          items: [
            {
              price: process.env.STRIPE_FREE_PLAN_PRICE_ID,
            },
          ],
        });

        const updatedBilling = {
          provider: "stripe",
          customerId: subscriptionCreated?.customer as string,
          subscription: {
            id: subscriptionCreated?.id,
            endDate: subscriptionCreated?.current_period_end,
            key: "sub::free",
            valid: true,
          },
        };

        await convex.mutation(api.clients.updateClient, {
          billing: updatedBilling,
          customerId: subscriptionCreated?.customer as string,
        });

        const deletedSubscriptionClient = await convex.query(
          api.clients.getClientByCustomerId,
          {
            customerId: subscriptionCreated?.customer as string,
          }
        );

        if (!deletedSubscriptionClient || !deletedSubscriptionClient?.ownerId) {
          return NextResponse.json(
            { error: "Client not found" },
            {
              status: 400,
              headers: corsHeaders,
            }
          );
        }

        return NextResponse.json(
          { message: "Subscription deleted" },
          {
            status: 200,
            headers: corsHeaders,
          }
        );

      case "invoice.payment_succeeded":
        const successfulInvoice = event.data.object;

        const subscription = await stripe.subscriptions.retrieve(
          successfulInvoice?.subscription as string
        );

        const successfulBilling = {
          provider: "stripe",
          customerId: subscription?.customer as string,
          subscription: {
            id: subscription?.id,
            endDate: subscription?.current_period_end,
            key:
              (subscription as any)?.plan?.id ===
              process.env.STRIPE_FREE_PLAN_PRICE_ID
                ? "sub::free"
                : (subscription as any)?.plan?.id ===
                    process.env.STRIPE_BASIC_PLAN_PRICE_ID
                  ? "sub::basic"
                  : (subscription as any)?.plan?.id ===
                      process.env.STRIPE_TEAM_PLAN_PRICE_ID
                    ? "sub::team"
                    : (subscription as any)?.plan?.id ===
                        process.env.STRIPE_BUSINESS_PLAN_PRICE_ID
                      ? "sub::business"
                      : (subscription as any)?.plan?.id ===
                          process.env.STRIPE_PRO_PLAN_PRICE_ID
                        ? "sub::pro"
                        : (subscription as any)?.plan?.id ===
                            process.env.STRIPE_GROWTH_PLAN_PRICE_ID
                          ? "sub::growth"
                          : "sub::unknown",
            valid: true,
          },
        };

        await convex.mutation(api.clients.updateClient, {
          billing: successfulBilling,
          customerId: subscription?.customer as string,
        });

        const successfulBillingClient = await convex.query(
          api.clients.getClientByCustomerId,
          {
            customerId: subscription?.customer as string,
          }
        );

        if (!successfulBillingClient || !successfulBillingClient?.ownerId) {
          return NextResponse.json(
            { error: "Client not found" },
            {
              status: 400,
              headers: corsHeaders,
            }
          );
        }

        return NextResponse.json(
          { message: "Invoice payment succeeded" },
          {
            status: 200,
            headers: corsHeaders,
          }
        );

      case "invoice.payment_failed":
        const failedInvoice = event.data.object;

        const currentSubscription = await stripe.subscriptions.retrieve(
          failedInvoice?.subscription as string
        );

        const currentBilling = {
          provider: "stripe",
          customerId: currentSubscription?.customer as string,
          subscription: {
            id: currentSubscription?.id,
            endDate: currentSubscription?.current_period_end,
            key:
              (currentSubscription as any)?.plan?.id ===
              process.env.STRIPE_FREE_PLAN_PRICE_ID
                ? "sub::free"
                : (currentSubscription as any)?.plan?.id ===
                    process.env.STRIPE_BASIC_PLAN_PRICE_ID
                  ? "sub::basic"
                  : (currentSubscription as any)?.plan?.id ===
                      process.env.STRIPE_TEAM_PLAN_PRICE_ID
                    ? "sub::team"
                    : (currentSubscription as any)?.plan?.id ===
                        process.env.STRIPE_BUSINESS_PLAN_PRICE_ID
                      ? "sub::business"
                      : (currentSubscription as any)?.plan?.id ===
                          process.env.STRIPE_PRO_PLAN_PRICE_ID
                        ? "sub::pro"
                        : (currentSubscription as any)?.plan?.id ===
                            process.env.STRIPE_GROWTH_PLAN_PRICE_ID
                          ? "sub::growth"
                          : "sub::unknown",

            valid: currentSubscription?.status !== "active" ? false : true,
            reason:
              currentSubscription?.status !== "active"
                ? "payment-failed"
                : "undefined",
          },
        };

        await convex.mutation(api.clients.updateClient, {
          billing: currentBilling,
          customerId: currentSubscription?.customer as string,
        });

        const failedBillingClient = await convex.query(
          api.clients.getClientByCustomerId,
          {
            customerId: currentSubscription?.customer as string,
          }
        );

        if (!failedBillingClient || !failedBillingClient?.ownerId) {
          return NextResponse.json(
            { error: "Client not found" },
            {
              status: 400,
              headers: corsHeaders,
            }
          );
        }


        return NextResponse.json(
          { message: "Invoice payment failed" },
          {
            status: 200,
            headers: corsHeaders,
          }
        );

      default:
        return NextResponse.json(
          { message: "Unhandled event" },
          {
            status: 200,
            headers: corsHeaders,
          }
        );
    }
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
