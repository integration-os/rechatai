import { httpRouter } from "convex/server";
import { updateClient } from "./stripe";

const http = httpRouter();

http.route({
  path: "/updateClient",
  method: "POST",
  handler: updateClient,
});

export default http;