import "server-only";
import {
  createRenderTool,
  integrate,
  updateAIStateWithToolCall,
} from "../ai-helper";
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
import { ConfirmationPromptServer } from "../../../components/ai/confirm-action-server";

const toolDescription =
  "Load the data for the user into Rechat's context. If the user asks to load all their data of any model, pass in a higher limit.";
const params = z.object({
  modelName: z.string().describe("The name of the data model to load"),
  connectionKey: z.string().describe("The connectionKey to use"),
  platform: z.string().describe("The platform to use"),
  limit: z
    .number()
    .optional()
    .describe("The number of records to load, default is 10"),
  cursor: z
    .string()
    .optional()
    .describe("The cursor to use for pagination, default is undefined"),
  queryParams: z
    .array(z.object({ key: z.string(), value: z.string() }))
    .optional(),
  nextStep: z
    .object({
      question: z
        .string()
        .describe(
          "The next step to execute, presented as a question for the user."
        ),
      actionable: z
        .boolean()
        .optional()
        .describe("If the next step is actionable by the user."),
      confirmText: z
        .string()
        .optional()
        .describe(
          "The text to display on the button to the user to confirm the next step."
        ),
      declineText: z
        .string()
        .optional()
        .describe(
          "The text to display on the button to the user to decline the next step."
        ),
    })
    .describe(
      "The next step to execute, presented as a question for the user."
    ),
});

export const loadDataTool = () => {
  const aiState = getMutableAIState<typeof AI>();

  return createRenderTool(
    params,
    async function* ({
      modelName,
      connectionKey,
      platform,
      queryParams,
      nextStep,
      limit = 10,
      cursor,
    }) {
      let summary = "";
      const toolCallId = nanoid();

      const { userId } = auth();

      if (!userId) {
        return (
          <BotCard>
            <LoadingPromptServer
              loaded
              loadedMessage="Failed to load data. User not authenticated."
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
              loadedMessage="Failed to load data. Invalid connection key."
              state="loaded-error"
            />
          </BotCard>
        );
      }

      yield (
        <BotCard>
          <LoadingPromptServer
            message={`Loading the data for ${platform} data model ${modelName}...`}
          />
        </BotCard>
      );

      console.log(
        `Loading data for platform: ${platform}, and model: ${modelName} with connection key ${connectionKey} with limit ${limit} and cursor ${cursor}`
      );

      try {
        const updatedQueryParams = queryParams
          ? queryParams?.reduce((acc, curr) => {
              return {
                ...acc,
                [curr.key]: curr.value,
              };
            }, {})
          : {};

        const data = await integrate[
          modelName.toLowerCase() as keyof typeof integrate
        ](connectionKey).list(
          {
            limit,
            cursor,
          },
          { passthroughQuery: updatedQueryParams }
        );

        summary = `${data?.unified?.length} ${modelName} loaded from ${platform}. `;

        // Remove _commonModel from each item in the unified array, this seem to break Convex for some reason.
        // todo: remove this once IntegrationOS natively returns the commonModel instead of _commonModel
        const unifiedWithoutCommonModel = safeJSON.parse(
          safeJSON
            .stringify(data.unified)
            .replace(/"_commonModel":/g, '"commonModel":')
        );

        const contextKey = generateContextKey({
          type: "data",
          connectionKey,
          model: modelName,
          platform,
        });

        await addOrUpdateKeyToSessionContext(
          aiState.get()._id as Id<"sessions">,
          contextKey,
          "data",
          {
            unified: unifiedWithoutCommonModel,
            pagination: data.pagination,
            meta: data.meta,
          }
        );

        await updateAIStateWithToolCall(
          aiState,
          "loadData",
          toolCallId,
          {
            modelName,
            connectionKey,
            platform,
            queryParams,
            nextStep,
            limit,
            cursor,
          },
          { summary, nextStep }
        );

        return (
          <BotCard>
            <div className="flex flex-col gap-2">
              <LoadingPromptServer
                loaded
                loadedMessage={`${data.unified?.length} records loaded from ${platform}'s ${modelName} model into the knowledge base.`}
              />
              <ConfirmationPromptServer
                promptText={nextStep.question}
                cancelText={nextStep.declineText}
                confirmText={nextStep.confirmText}
                hideButtons={!nextStep.actionable}
              />
            </div>
          </BotCard>
        );
      } catch (e: any) {
        // const deepError = safeJSON.parse(e.message)?.error || e.message;

        console.log(e, "<<<<<<< ERROR");
        await updateAIStateWithToolCall(
          aiState,
          "loadData",
          toolCallId,
          {
            modelName,
            connectionKey,
            platform,
            queryParams,
            nextStep,
            limit,
            cursor,
            error: safeJSON.stringify(e, null, 2),
          },
          { summary: "Failed to load data.", error: e },
          true
        );

        return (
          <BotCard>
            <div className="flex flex-col gap-4">
              <LoadingPromptServer
                loaded
                loadedMessage="Failed to load data."
                state="loaded-error"
              />
              <Markdown
                content={"```json\n" + safeJSON.stringify(e, null, 2) + "\n```"}
              />
              <ConfirmationPromptServer
                promptText="I encountered an issue while loading the data. How would you like to proceed?"
                confirmText="Explain the issue"
                cancelText="Cancel this operation"
              />
            </div>
          </BotCard>
        );
      }
    },
    toolDescription
  );
};
