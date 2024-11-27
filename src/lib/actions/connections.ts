import { fetchQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";
import { ensureToken } from "./helpers";

export async function getConnectionKeys() {
  const token = await ensureToken();
  try {
    const connections = await fetchQuery(
      api.connections.listConnections,
      {},
      { token }
    );
    return connections.map((connection) => connection.key);
  } catch (error) {
    console.error(error);
    return [];
  }
}
