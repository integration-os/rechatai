import { MutationCtx, QueryCtx } from "./_generated/server";

export async function ensureAuth(ctx: MutationCtx | QueryCtx) {
  try {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new Error("Unauthenticated call");
    }
    return identity;
  } catch (error) {
    console.error("Error in ensureAuth:", error);
    throw new Error("Authentication failed");
  }
}
