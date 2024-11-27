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
  "Create new data for the specified platform and model using IntegrationOS Unified APIs.";

const params = z.object({
  model: z.object({
    name: z.string().describe("The name of the data model to create"),
    connectionKey: z.string().describe("The connectionKey to use"),
    platform: z.string().describe("The platform to use"),
  }),
  queyParams: z.array(
    z
      .object({
        key: z.string(),
        value: z.string(),
      })
      .optional()
  ),
  data: z.array(
    z.object({
      key: z.string(),
      value: z.string(),
      dataType: z
        .string()
        .optional()
        .describe("The data type, e.g. string, number, array, object etc."),
      requiresParsing: z
        .boolean()
        .optional()
        .describe(
          "Whether the value requires parsing before sending to the API"
        ),
    })
  ),
});

export const createDataTool = () => {
  const aiState = getMutableAIState<typeof AI>();

  return createRenderTool(
    params,
    async function* ({ model, data, queyParams }) {
      const toolCallId = nanoid();
      const { name, connectionKey, platform } = model;

      yield (
        <BotCard>
          <LoadingPromptServer
            message={`Creating data for ${platform} data model ${name}...`}
          />
        </BotCard>
      );

      const { userId } = auth();

      if (!userId) {
        return (
          <BotCard>
            <LoadingPromptServer
              loaded
              loadedMessage="Failed to create data. User not authenticated."
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
              loadedMessage="Failed to create data. Invalid connection key."
              state="loaded-error"
            />
          </BotCard>
        );
      }

      console.log(
        `Creating data for platform: ${platform}, and model: ${name} with connection key ${connectionKey}`
      );

      try {
        const dataToCreate = await mapToUnifiedModelLLM({
          content: JSON.stringify(data),
          model: name,
        });
        const returnedData = await integrate[
          name.toLowerCase() as keyof typeof integrate
        ](connectionKey).create(dataToCreate.data, {
          passthroughQuery: queyParams
            ? queyParams?.reduce((acc: { [key: string]: string }, curr) => {
                if (!curr?.key || !curr?.value) return acc;
                acc[curr?.key] = curr?.value;
                return acc;
              }, {})
            : {},
        });
        const createdData = returnedData.unified;

        await updateAIStateWithToolCall(
          aiState,
          "createData",
          toolCallId,
          { model, data, queyParams },
          { createdData },
          false
        );

        return (
          <BotCard>
            <LoadingPromptServer
              loaded
              loadedMessage={`Created data successfully for ${platform}'s ${name} model.`}
            />
          </BotCard>
        );
      } catch (e: any) {
        const deepError = safeJSON.parse(e?.message)?.error;

        await updateAIStateWithToolCall(
          aiState,
          "createData",
          toolCallId,
          { model, data, queyParams },
          { deepError },
          true
        );

        return (
          <BotCard>
            <LoadingPromptServer
              loaded
              loadedMessage="Failed to create data."
              state="loaded-error"
            />
            <Markdown
              content={`\`\`\`json\n${safeJSON.stringify(deepError, null, 2)}\n\`\`\``}
            />
          </BotCard>
        );
      }
    },
    toolDescription
  );
};
