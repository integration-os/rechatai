import "server-only";
import { createRenderTool, integrate, updateAIStateWithToolCall } from "../ai-helper";
import { z } from "zod";
import { isConnectionKeyOwnedByUser, nanoid, safeJSON } from "@/lib/utils";
import { BotCard } from "@/components/ai/message";
import { Markdown } from "@/components/ui/markdown";
import { LoadingPromptServer } from "../../../components/ai/loading-action-server";
import { generateContextKey } from "@/lib/actions/helpers";
import { addOrUpdateKeyToSessionContext } from "@/lib/actions/sessions";
import { Id } from "../../../../convex/_generated/dataModel";
import { getMutableAIState } from "ai/rsc";
import { AI } from "../actions";
import { auth } from "@clerk/nextjs/server";

const toolDescription = "Get a single record for the user from the specified data model.";
const params = z.object({
  modelName: z.string().describe("The name of the data model to get the record from"),
  connectionKey: z.string().describe("The connectionKey to use"),
  platform: z.string().describe("The platform to use"),
  id: z.string().describe("The ID of the record to retrieve"),
  queryParams: z.array(
    z.object({ key: z.string(), value: z.string() }).optional()
  ),
  nextStep: z
    .string()
    .describe(
      "The next step to execute, presented as a question for the user."
    ),
});

export const getOneTool = () => {
  const aiState = getMutableAIState<typeof AI>();

  return createRenderTool(
    params,
    async function* ({
      modelName,
      connectionKey,
      platform,
      id,
      queryParams,
      nextStep,
    }) {
      let summary = "";
      const toolCallId = nanoid();

      const { userId } = auth();

      if (!userId) {
        return (
          <BotCard>
            <LoadingPromptServer
              loaded
              loadedMessage="Failed to get the record. User not authenticated."
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
              loadedMessage="Failed to get the record. Invalid connection key."
              state="loaded-error"
            />
          </BotCard>
        );
      }

      yield (
        <BotCard>
          <LoadingPromptServer
            message={`Retrieving the record from ${platform} data model ${modelName}...`}
          />
        </BotCard>
      );

      console.log(
        `Getting record for platform: ${platform}, model: ${modelName}, with connection key ${connectionKey}, and ID ${id}`
      );

      try {
        const updatedQueryParams = queryParams
          ? queryParams?.reduce((acc, curr) => {
              if (!curr) return acc;
              return {
                ...acc,
                [curr.key]: curr.value,
              };
            }, {})
          : {};

        const data = await integrate[
          modelName.toLowerCase() as keyof typeof integrate
        ](connectionKey).get(id, { passthroughQuery: updatedQueryParams });

        summary = `Record with ID ${id} retrieved from ${platform}'s ${modelName} model.`;

        const contextKey = generateContextKey({
          type: "data",
          connectionKey,
          model: modelName,
          platform,
        }, id);

        await addOrUpdateKeyToSessionContext(
          aiState.get()._id as Id<"sessions">,
          contextKey,
          "data",
          {
            unified: data.unified,
            meta: data.meta,
          }
        );

        await updateAIStateWithToolCall(
          aiState,
          "getOne",
          toolCallId,
          { modelName, connectionKey, platform, id, queryParams, nextStep },
          { summary, nextStep }
        );

        return (
          <BotCard>
            <div className="flex flex-col gap-2">
              <LoadingPromptServer
                loaded
                loadedMessage={`Record with ID ${id} retrieved from ${platform}'s ${modelName} model and added to the knowledge base.`}
              />
              {nextStep && <p>{nextStep}</p>}
            </div>
          </BotCard>
        );
      } catch (e: any) {
        const deepError = safeJSON.parse(e.message)?.error || e.message;
        await updateAIStateWithToolCall(
          aiState,
          "getOne",
          toolCallId,
          { modelName, connectionKey, platform, id, queryParams, nextStep },
          { summary: "Failed to retrieve the record.", error: deepError }
        );

        return (
          <BotCard>
            <div className="flex flex-col gap-4">
              <LoadingPromptServer
                loaded
                loadedMessage="Failed to retrieve the record."
                state="loaded-error"
              />
              <Markdown
                content={
                  "```json\n" + safeJSON.stringify(deepError, null, 2) + "\n```"
                }
              />
            </div>
          </BotCard>
        );
      }
    },
    toolDescription
  );
};