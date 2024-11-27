import "server-only";
import { createRenderTool, updateAIStateWithToolCall } from "../ai-helper";
import { z } from "zod";
import { nanoid, safeJSON } from "@/lib/utils";
import { BotCard } from "@/components/ai/message";
import { Markdown } from "@/components/ui/markdown";
import { LoadingPromptServer } from "../../../components/ai/loading-action-server";
import { getMutableAIState } from "ai/rsc";
import { AI } from "../actions";
import { BuildingUiPendingServer } from "../../../components/ai/building-ui-pending-server";
import { getUniqueModelTypes } from "../../../app/actions/integrationos";
import { generateObject, ToolContent, generateText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { fetchMutation } from "convex/nextjs";
import { claudUISysPromptV1 } from "../system-prompts";
import { DynamicServerComponent } from "../../dynamic-ui/server-dynamic-component";
import { openai } from "@ai-sdk/openai";
import { api } from "../../../../convex/_generated/api";
import { createInitialApp } from "../../actions/apps";
import { ControlledCodeEditorWithAI } from "../../../controlled-components/controlled-code-editor-with-ai";
import { ServerControlledCodeEditorWithAI } from "../../../controlled-components/server-controlled-code-editor-with-ai";
import { auth } from "@clerk/nextjs/server";

const toolDescription =
  "An AI agent that is able to generate custom UI code given a message and data models. Always re-summarize the user request, this agent does not have memory. Does not require confirmation.";

const params = z.object({
  prompt: z.string(),
  passPriorCode: z
    .boolean()
    .describe("Whether to pass the prior code to the AI"),
  platformCaveats: z
    .string()
    .optional()
    .describe(
      "Any platform specific caveats that the UI builder should be aware of."
    ),
  suggestionToResolveCode: z
    .string()
    .optional()
    .describe(
      "The suggestion to resolve the code in case the user reported an issue and you can spot the issue."
    ),
  models: z
    .array(
      z.object({
        platform: z.string(),
        connectionKey: z.string(),
        models: z
          .array(z.string())
          .describe("The name of the data model in lowercase"),
      })
    )
    .describe("The data models to use for generating the UI")
    .optional(),
});

export const customUIGeneratorTool = () => {
  const aiState = getMutableAIState<typeof AI>();

  return createRenderTool(
    params,
    async function* ({
      prompt,
      models,
      passPriorCode,
      suggestionToResolveCode,
      platformCaveats,
    }) {
      yield <BuildingUiPendingServer />;

      const { orgId } = auth();

      const toolCallId = nanoid();
      const modelsArray = Array.from(
        new Set(models?.flatMap((model) => model.models) || [])
      );
      const types = await getUniqueModelTypes(modelsArray);
      const typesTemplate = modelsArray.length
        ? `
        <types primaryModels="${modelsArray.join(", ")}">
          ${types}
        </types>
      `
        : "";

      let priorCode;
      let lastToolCall = null;

      if (passPriorCode) {
        lastToolCall = aiState
          .get()
          .messages.filter(
            (message) =>
              message.role === "tool" &&
              message?.content?.[0]?.toolName === "createCustomUI"
          )
          .pop();
      }

      if (lastToolCall) {
        priorCode = (lastToolCall?.content as ToolContent)?.[0]?.result as {};
      }

      try {
        const { object } = await generateObject({
          model: anthropic("claude-3-5-sonnet-latest"),
          prompt: `Create a custom UI for the following prompt: ${prompt}
            available connection keys and models: ${JSON.stringify(models, null, 2)}

            <priorCode>
              ${priorCode ? safeJSON.stringify(priorCode) : "No prior code available"}
            </priorCode>

            <suggestionToResolveCode>
              ${suggestionToResolveCode || "No suggestion to resolve code available"}
            </suggestionToResolveCode>

            ADHERE TO THE DATA STRUCTURE OF THE COMMON MODEL \`${modelsArray.join(", ")}\`.
          `,
          schema: z.object({
            plan: z.string(),
            code: z.string(),
            title: z.string().describe("The title of the UI/App created"),
            description: z.string().optional(),
          }),
          //   messages: [],
          temperature: 0.8,
          system: claudUISysPromptV1(
            typesTemplate,
            platformCaveats || "No platform caveats available"
          ),
        });

        

        const app = await createInitialApp({
          title: object.title,
          description: object.description || "",
          code: object.code,
          prompt: prompt,
          organizationId: orgId as string,
          platformsUsed: models || [],
        });

        await updateAIStateWithToolCall(
          aiState,
          "createCustomUI",
          toolCallId,
          { prompt, models, passPriorCode, suggestionToResolveCode },
          {
            title: object.title,
            description: object.description,
            code: object.code,
            appId: app.appId,
          },
          false
        );

        return (
          <BotCard>
            <div className="flex flex-col gap-4">
              <LoadingPromptServer
                loaded
                loadedMessage="Your app is ready"
              />
              <ServerControlledCodeEditorWithAI
                code={object.code}
                appId={app?.appId}
              />
            </div>
          </BotCard>
        );
      } catch (error) {
        await updateAIStateWithToolCall(
          aiState,
          "createCustomUI",
          toolCallId,
          { prompt, models, passPriorCode, suggestionToResolveCode },
          { error },
          true
        );

        return (
          <BotCard>
            <LoadingPromptServer
              loaded
              loadedMessage="Failed to render UI."
              state="loaded-error"
            />
            <Markdown
              content={`\`\`\`json\n${JSON.stringify(error, null, 2)}\n\`\`\``}
            />
          </BotCard>
        );
      }
    },
    toolDescription
  );
};
