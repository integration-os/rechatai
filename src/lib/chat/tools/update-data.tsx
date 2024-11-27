import "server-only";
import {
  createRenderTool,
  integrate,
  mapToUnifiedModelLLM,
  updateAIStateWithToolCall,
} from "../ai-helper";
import { z } from "zod";
import { isConnectionKeyOwnedByUser, nanoid, safeJSON } from "@/lib/utils";
import { BotCard } from "@/components/ai/message";
import { Markdown } from "@/components/ui/markdown";
import { LoadingPromptServer } from "../../../components/ai/loading-action-server";
import { getMutableAIState } from "ai/rsc";
import { AI } from "../actions";
import { auth } from "@clerk/nextjs/server";

const toolDescription =
  "Update existing data for the specified platform and model.";

const params = z.object({
  id: z.string().describe("The ID of the record to update"),
  modelName: z.string().describe("The name of the data model to update"),
  connectionKey: z.string().describe("The connectionKey to use"),
  platform: z.string().describe("The platform name in lowercase"),
  data: z.array(
    z.object({
      key: z.string(),
      value: z.string(),
    })
  ),
});

export const updateDataTool = () => {
  const aiState = getMutableAIState<typeof AI>();

  return createRenderTool(
    params,
    async function* ({ modelName, connectionKey, data, platform, id }) {
      const toolCallId = nanoid();

      yield (
        <BotCard>
          <LoadingPromptServer
            loadedMessage={`Updating data for ${platform}'s ${modelName} model...`}
          />
        </BotCard>
      );

      const { userId } = auth();

      if (!userId) {
        return (
          <BotCard>
            <LoadingPromptServer
              loaded
              loadedMessage="Failed to update data. User not authenticated."
              state="loaded-error"
            />
          </BotCard>
        );
      }

      if (!isConnectionKeyOwnedByUser(connectionKey, userId)) {
        return (
          <BotCard>
            <LoadingPromptServer
              loaded
              loadedMessage="Failed to update data. Invalid connection key."
              state="loaded-error"
            />
          </BotCard>
        );
      }

      console.log(
        `Updating data for platform: ${platform}, and model: ${modelName} with connection key ${connectionKey}`
      );

      try {
        const dataToUpdate = await mapToUnifiedModelLLM({
          content: JSON.stringify(data),
          model: modelName,
        });

        const returnedData = await integrate[
          modelName.toLowerCase() as keyof typeof integrate
        ](connectionKey).update(id, dataToUpdate.data);

        await updateAIStateWithToolCall(
          aiState,
          "updateData",
          toolCallId,
          { modelName, connectionKey, platform, data, id },
          { metadataFromUnifiedUpdateCall: returnedData.meta },
          false
        );

        return (
          <BotCard>
            <LoadingPromptServer
              loaded
              loadedMessage={`Updated data successfully for ${platform}'s ${modelName} model.`}
            />
          </BotCard>
        );
      } catch (e: any) {
        const deepError = safeJSON.parse(e?.message)?.error || e.message;

        await updateAIStateWithToolCall(
          aiState,
          "updateData",
          toolCallId,
          { modelName, connectionKey, platform, data, id },
          { error: deepError },
          true
        );

        return (
          <BotCard>
            <LoadingPromptServer
              loaded
              loadedMessage="Failed to update data."
              state="loaded-error"
            />
            <Markdown
              content={
                "```json\n" + safeJSON.stringify(deepError, null, 2) + "\n```"
              }
            />
          </BotCard>
        );
      }
    },
    toolDescription
  );
};
