import { ActionCtx, httpAction } from "./_generated/server";
import { api } from "./_generated/api";

export const updateClient = httpAction(async (ctx: ActionCtx, request: Request) => {
  const { billing, customerId } = await request.json();

  await ctx.runMutation(api.clients.updateClient, {
    billing,
    customerId,
  });

  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
});