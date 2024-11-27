import "server-only";
import {
  createRenderTool,
  integrate,
  updateAIStateWithToolCall,
} from "../ai-helper";
import { z } from "zod";
import { nanoid, safeJSON } from "@/lib/utils";
import { BotCard } from "@/components/ai/message";
import { Markdown } from "@/components/ui/markdown";
import { LoadingPromptServer } from "../../../components/ai/loading-action-server";
import { generateContextKey } from "@/lib/actions/helpers";
import { addOrUpdateKeyToSessionContext } from "@/lib/actions/sessions";
import { Id } from "../../../../convex/_generated/dataModel";
import { getMutableAIState } from "ai/rsc";
import { AI } from "../actions";
import { IntegrationOS } from "@integrationos/node";
import { ConfirmationPromptServer } from "../../../components/ai/confirm-action-server";

const toolDescription =
  "Show the user a Yes/No UI to confirm an action. This must be used before any action that loads or modifies data.";
const params = z.object({
  message: z.string(),
  cancelText: z.string().optional(),
  confirmText: z.string().optional(),
});
export const getUserConfirmationTool = () => {
  const aiState = getMutableAIState<typeof AI>();

  return createRenderTool(
    params,
    async function ({ message, cancelText, confirmText }) {
      const toolCallId = nanoid();

      await updateAIStateWithToolCall(
        aiState,
        "getUserConfirmation",
        toolCallId,
        { message },
        {},
        false
      );

      return (
        <BotCard>
          <ConfirmationPromptServer
            promptText={message}
            cancelText={cancelText}
            confirmText={confirmText}
          />
        </BotCard>
      );
    },
    toolDescription
  );
};
