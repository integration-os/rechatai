// "use server";

import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import { getUniqueModelTypes } from "../../app/actions/integrationos";
import { ReactNode } from "react";
import { AIState } from "./actions";
import { nanoid } from "../utils";
import { IntegrationOS } from "@integrationos/node";
import { retryAsync } from "../actions/helpers";
import { updateSession } from "../actions/sessions";
import { Id } from "../../../convex/_generated/dataModel";

const titleSystemPrompt = `Generate a concise and descriptive title based on the user's intent. This title will be used for the session, so ensure it is precise and relevant.`;
const dataTypeSystemPrompt = `Determine if the question requires a specific data type to be answered. If so, specify the data type model name required.
Actions that requires the types to be knows are:
- Create
- Update

Every other action does not require the data type to be known.
`;

const mapToUnifiedModelSystemPrompt = `You are an experienced IntegrationOS engineer. 
Your task is to extract the correct JSON from the passed content and return the JSON in the unified model format.
The user will provide you with the content and the model name types.

# Rules:
- Only work with the data provided, don't add or remove any data.
- Don't add the 'model' key to the JSON, it will be added automatically.
`;

export const getSessionTitleLLM = async ({ content }: { content: string }) => {
  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    prompt: content,
    schema: z.object({
      title: z.string().describe("The title of the session between 3-8 words."),
    }),
    system: titleSystemPrompt,
    temperature: 0.9,
  });

  return object.title;
};

export const isDataTypesRequiredLLM = async ({
  content,
}: {
  content: string;
}) => {
  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    prompt: content,
    schema: z.object({
      models: z
        .array(z.string())
        .describe("The data type model name required to answer the question."),
      requiresDataType: z
        .boolean()
        .describe(
          "Whether the question requires a specific data type to be answered."
        ),
    }),
    system: dataTypeSystemPrompt,
  });

  return object;
};

export const mapToUnifiedModelLLM = async ({
  content,
  model,
}: {
  content: string;
  model: string;
}) => {
  const types = await getUniqueModelTypes([model]);

  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    prompt: `
    # Unified Model Types for ${model}
    ${types}

    # Content
    ${content}
    `,
    schema: z.object({
      data: z.any(),
    }),
    system: mapToUnifiedModelSystemPrompt,
  });

  return object;
};

type Streamable = ReactNode | Promise<ReactNode>;

type Renderer<T extends Array<any>> = (
  ...args: T
) =>
  | Streamable
  | Generator<Streamable, Streamable, void>
  | AsyncGenerator<Streamable, Streamable, void>;

type RenderTool<T extends z.ZodTypeAny = z.ZodTypeAny> = {
  description?: string;
  parameters: T;
  generate?: Renderer<
    [
      z.infer<T>,
      {
        toolName: string;
        toolCallId: string;
      },
    ]
  >;
};

export function createRenderTool<T extends z.ZodTypeAny>(
  parameters: T,
  generate?: RenderTool<T>["generate"],
  description?: string
): RenderTool<T> {
  return {
    description,
    parameters,
    generate,
  };
}

export async function updateAIStateWithToolCall<T extends AIState>(
  aiState: {
    get: () => T;
    done: (newState: T) => void;
  },
  toolName: string,
  toolCallId: string,
  args: Record<string, unknown>,
  result: Record<string, unknown>,
  isError: boolean = false
) {
  const currentState = aiState.get();

  if (currentState?.messages) {
    const newState = {
      ...currentState,
      messages: [
        ...currentState.messages,
        {
          id: nanoid(),
          role: "assistant" as const,
          createdAt: Date.now(),
          content: [
            {
              type: "tool-call" as const,
              toolName,
              toolCallId,
              args,
            },
          ],
        },
        {
          id: nanoid(),
          role: "tool" as const,
          createdAt: Date.now(),
          content: [
            {
              type: "tool-result" as const,
              toolName,
              toolCallId,
              result,
              isError,
            },
          ],
        },
      ],
    };

    aiState.done(newState);

    await retryAsync(async () => {
      await updateSession(newState._id as Id<"sessions">, newState.messages);
    }, 3);
  } else {
    console.error("AI state or messages are undefined");
  }
}

export const integrate = new IntegrationOS(
  process.env.INTEGRATIONOS_API_KEY as string
);
