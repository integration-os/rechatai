import "server-only";
import { createRenderTool, updateAIStateWithToolCall } from "../ai-helper";
import { z } from "zod";
import { nanoid } from "@/lib/utils";
import { BotCard } from "@/components/ai/message";
import { getMutableAIState } from "ai/rsc";
import { AI } from "../actions";
import { AddConnectionButtonServer } from "@/components/ai/add-connection-button-server";

const toolDescription =
  "Add a new connection to a platform when the user needs to connect to a new integration or when data from an unconnected platform is requested.";
const params = z.object({
  platform: z.string().describe("The platform to connect to in camel case"),
  platformName: z.string().describe("The platform name in sentence case"),
  message: z.string().describe("The message explaining why the connection is needed"),
});

export const addConnectionTool = () => {
  const aiState = getMutableAIState<typeof AI>();

  return createRenderTool(
    params,
    async function ({ platform, message, platformName }) {
      const toolCallId = nanoid();

      await updateAIStateWithToolCall(
        aiState,
        "addConnection",
        toolCallId,
        { platform, platformName, message },
        {},
        false
      );

      return (
        <BotCard>
          <div className="flex flex-col gap-2 shrink">
            <p className="text-sm">{message}</p>
            <div>
              <AddConnectionButtonServer platform={platform} platformName={platformName} />
            </div>
            <p className="text-xs">
              You can manage your connections at any time in your account settings.
            </p>
          </div>
        </BotCard>
      );
    },
    toolDescription
  );
};
