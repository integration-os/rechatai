// import { v } from "convex/values";
// import { mutation } from "../_generated/server";

// export const updateSession = mutation({
//   args: {},
//   handler: async (ctx, args) => {
//     const sessions = await ctx.db.query("sessions").collect();

//     for (const session of sessions) {
//       await ctx.db.patch(session._id, { authorId: undefined });
//     }
//   },
// });
