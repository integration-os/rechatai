import "server-only";
import { createRenderTool, updateAIStateWithToolCall } from "../ai-helper";
import { z } from "zod";
import { nanoid } from "@/lib/utils";
import { BotCard } from "@/components/ai/message";
import { LoadingPromptServer } from "../../../components/ai/loading-action-server";
import { getMutableAIState } from "ai/rsc";
import { AI } from "../actions";
import { DynamicFormServer } from "../../../components/ai/dynamic-form-server";

const toolDescription = "Render a dynamic form with custom fields. Used when the user needs to input data through a flexible form interface.";

const params = z.object({
  formFields: z.array(
    z.object({
      type: z.enum([
        "text",
        "checkbox",
        "select",
        "textarea",
        "switch",
        "radio",
        "number",
        "date",
      ]),
      name: z.string(),
      label: z.string(),
      options: z.array(z.string()).optional(),
      value: z.union([z.string(), z.boolean(), z.number()]).optional(),
    })
  ),
  formTitle: z.string(),
});

export const renderDynamicFormTool = () => {
  const aiState = getMutableAIState<typeof AI>();

  return createRenderTool(
    params,
    async function* ({ formFields, formTitle }) {
      const toolCallId = nanoid();

      yield (
        <BotCard>
          <LoadingPromptServer message="Generating form..." />
        </BotCard>
      );

      try {
        await updateAIStateWithToolCall(
          aiState,
          "renderDynamicForm",
          toolCallId,
          { formFields, formTitle },
          {},
          false
        );

        return (
          <BotCard>
            <div className="container mx-auto p-4">
              <h2 className="text-xl font-bold mb-4">{formTitle}</h2>
              <DynamicFormServer fields={formFields} toolCallId={toolCallId} />
            </div>
          </BotCard>
        );
      } catch (e: any) {
        await updateAIStateWithToolCall(
          aiState,
          "renderDynamicForm",
          toolCallId,
          { formFields, formTitle },
          { error: e.message },
          true
        );

        return (
          <BotCard>
            <LoadingPromptServer
              loaded
              loadedMessage="Failed to generate form."
              state="loaded-error"
            />
          </BotCard>
        );
      }
    },
    toolDescription
  );
};