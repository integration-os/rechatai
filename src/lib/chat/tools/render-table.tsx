import "server-only";
import { createRenderTool, updateAIStateWithToolCall } from "../ai-helper";
import { z } from "zod";
import { nanoid } from "@/lib/utils";
import { BotCard } from "@/components/ai/message";
import { LoadingPromptServer } from "../../../components/ai/loading-action-server";
import { getMutableAIState } from "ai/rsc";
import { AI } from "../actions";
import { AdvancedTableServer } from "../../../components/ui/advanced-table-server";

const toolDescription = "Render a table of data for a model and connection key. Used when the user asks to see their data generally without any specific query or a use case.";

const params = z.object({
  connectionKey: z.string(),
  modelName: z.string(),
});

export const renderTableTool = () => {
  const aiState = getMutableAIState<typeof AI>();

  return createRenderTool(
    params,
    async function* ({ connectionKey, modelName }) {
      const toolCallId = nanoid();

      yield (
        <BotCard>
          <LoadingPromptServer message="Rendering table..." />
        </BotCard>
      );

      try {
        await updateAIStateWithToolCall(
          aiState,
          "renderTable",
          toolCallId,
          { connectionKey, modelName },
          {},
          false
        );

        return (
          <BotCard>
            <div className="container mx-auto max-h-[1200px] overflow-auto">
              <AdvancedTableServer
                connectionKey={connectionKey}
                model={modelName}
              />
            </div>
          </BotCard>
        );
      } catch (e: any) {
        await updateAIStateWithToolCall(
          aiState,
          "renderTable",
          toolCallId,
          { connectionKey, modelName },
          { error: e.message },
          true
        );

        return (
          <BotCard>
            <LoadingPromptServer
              loaded
              loadedMessage="Failed to render table."
              state="loaded-error"
            />
          </BotCard>
        );
      }
    },
    toolDescription
  );
};