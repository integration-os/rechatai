"use server";
import { anthropic } from "@ai-sdk/anthropic";
import { generateObject } from "ai";
import { z } from "zod";
import { AIModel } from "@/components/ui/ai-assistant-panel";
import { openai } from "@ai-sdk/openai";
import { aiCodeAssistantPrompt } from "../../lib/chat/system-prompts/ai-code-assistant";

export const changeCode = async ({
  code,
  message,
  model = "Rechat UI Assistant",
}: {
  code: string;
  message: string;
  model: AIModel;
}) => {
  try {
    let aiModel;
    switch (model) {
      case "Claude 3.5 Sonnet":
      case "Rechat UI Assistant":
        aiModel = anthropic("claude-3-5-sonnet-latest");
        break;
      case "Rechat Connection Assistant":
        aiModel = openai("gpt-4o");
        break;
      case "Rechat Logic Assistant":
        aiModel = openai("gpt-4o-mini");
        break;
      default:
        aiModel = anthropic("claude-3-5-sonnet-latest");
    }

    const { object } = await generateObject({
      model: aiModel,
      prompt: `
      User code:
      ${code}

      User message:
      ${message}
      `,
      schema: z.object({
        code: z.string(),
        explanation: z
          .string()
          .describe(
            "A concise summary of the code modifications, focusing on the key changes rather than a comprehensive explanation of the entire codebase."
          ),
      }),
      temperature: 0,
      system: aiCodeAssistantPrompt({}),
    });
    return object;
  } catch (error) {
    console.error("Error in changeCode:", error);
    throw new Error("Failed to process code change request");
  }
};
