"use server";
import { AI } from "@/lib/chat/actions";
import { Chat as ChatComponent } from "../../components/chat";
import { getSessionById } from "../../lib/actions/sessions";
import { Id } from "../../../convex/_generated/dataModel";

export const Chat = async ({ sessionId }: { sessionId?: string }) => {
  const session =
    sessionId && (await getSessionById(sessionId as Id<"sessions">));

  return (
    <AI
      initialAIState={
        session && session._id ? { ...session } : { messages: [] }
      }
    >
      <ChatComponent sessionId={sessionId} />
    </AI>
  );
};
