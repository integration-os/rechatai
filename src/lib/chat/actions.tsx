import "server-only";

import {
  createAI,
  getMutableAIState,
  streamUI,
  createStreamableValue,
  getAIState,
} from "ai/rsc";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { getModels, getUniqueModelTypes } from "@/app/actions/integrationos";
import { nanoid, safeJSON } from "@/lib/utils";
import {
  BotCard,
  BotMessage,
  SpinnerMessage,
  UserMessage,
} from "@/components/ai/message";
import { Chat, Message } from "@/lib/types";
import { Markdown } from "@/components/ui/markdown";
import { AssistantContent, ToolResultPart } from "ai";
import { openAISysPrompt } from "./system-prompts";
import { DynamicServerComponent } from "../dynamic-ui/server-dynamic-component";
import { Doc, Id } from "../../../convex/_generated/dataModel";
import { auth } from "@clerk/nextjs/server";
import { Badge } from "../../components/ui/badge";
import { getSessionTitleLLM, isDataTypesRequiredLLM } from "./ai-helper";
import {
  createSession,
  getSessionById,
  updateSession,
  updateSessionUsage,
} from "../actions/sessions";
import { LoadingPromptServer } from "../../components/ai/loading-action-server";
import { ConfirmationPromptServer } from "../../components/ai/confirm-action-server";
import { getConnectionKeys } from "../actions/connections";
import { loadDataTool } from "./tools/load-data";
import { createDataTool } from "./tools/create-data";
import { updateDataTool } from "./tools/update-data";
import { getUserConfirmationTool } from "./tools/user-confirmation";
import { GenericTable } from "../../components/generic-table";
import { customUIGeneratorTool } from "./tools/create-custom-ui";
import { renderTableTool } from "./tools/render-table";
import { renderDynamicFormTool } from "./tools/render-dynamic-form";
import { DynamicForm } from "@/components/ai/dynamic-form";
import { getOneTool } from "./tools/get-one";
import { addConnectionTool } from "./tools/add-connection";
import { integrationOSCaveats } from "./integrationos-caveats";
import { retryAsync } from "../actions/helpers";
import { ServerControlledCodeEditorWithAI } from "../../controlled-components/server-controlled-code-editor-with-ai";

async function submitUserMessage(content: string) {
  "use server";

  const history = getMutableAIState<typeof AI>();

  const { getToken, orgId } = auth();

  const token = await getToken({
    template: "convex",
  });

  if (!token) {
    throw new Error("User not found");
  }

  let session = history.get();

  if (session._id === "" || !session._id) {
    const sessionTitle = await getSessionTitleLLM({ content });

    const sessionId = await createSession({
      messages: history.get().messages,
      title: sessionTitle,
      organizationId: orgId || undefined,
    });

    session = await getSessionById(sessionId as Id<"sessions">);

    history.update({
      ...history.get(),
      ...session,
    });
  }

  if (!session) {
    throw new Error("Session not found");
  }

  history.update({
    ...session,
    messages: [
      ...session.messages,
      {
        id: nanoid(),
        role: "user",
        content,
        createdAt: Date.now(),
      },
    ],
  });

  session = history.get();

  await updateSession(session?._id as Id<"sessions">, session?.messages || []);

  const connections = await getConnectionKeys();

  const platforms = connections.map(
    (connection: string) => connection.split("::")[1]
  );

  const models = await Promise.all(
    platforms.map(async (platform: string) => {
      const models = await getModels(platform);
      return {
        platform,
        models,
        caveats:
          integrationOSCaveats[platform as keyof typeof integrationOSCaveats],
      };
    })
  );

  let textStream: undefined | ReturnType<typeof createStreamableValue<string>>;
  let textNode: undefined | React.ReactNode;

  // get last 5 messages
  const lastMessages = session.messages.slice(-5);
  const { models: typesModels, requiresDataType } =
    await isDataTypesRequiredLLM({
      content: safeJSON.stringify(lastMessages),
    });

  let commonModelsTypes;

  if (requiresDataType) {
    commonModelsTypes = await getUniqueModelTypes(typesModels);
  }

  const result = await streamUI({
    model: openai("gpt-4o"),
    initial: <LoadingPromptServer message="Thinking..." />,
    system: openAISysPrompt(
      connections,
      models,
      JSON.stringify(JSON.stringify(session.context), null, 2),
      commonModelsTypes
    ),
    // The message here is set to any because we need to allow for coverage in the tools and the content
    // This should be better typed in the future
    messages: session.messages.map((message: any) => ({
      role: message.role,
      content: message.content,
      name: message.name,
    })),
    text: async ({ content, done, delta }) => {
      if (!textStream) {
        textStream = createStreamableValue("");
        textNode = <BotMessage content={textStream.value} />;
      }

      if (done) {
        textStream.done();
        history.done({
          ...session,
          messages: [
            ...session.messages,
            {
              id: nanoid(),
              createdAt: Date.now(),
              role: "assistant",
              content,
            },
          ],
        });

        session = history.get();

        await updateSession(
          session?._id as Id<"sessions">,
          session?.messages || []
        );
      } else {
        textStream.update(delta);
      }

      return textNode;
    },

    maxRetries: 5,
    tools: {
      // createData: createDataTool(),
      // loadData: loadDataTool(),
      // updateData: updateDataTool(),

      // getUserConfirmation: getUserConfirmationTool(),

      createCustomUI: customUIGeneratorTool(),

      // renderTable: renderTableTool(),

      // renderDynamicForm: renderDynamicFormTool(),
      // getOne: getOneTool(),

      // showTable: {
      //   description: "Show a table of generic data",
      //   generate: async function* ({
      //     columns,
      //     data,
      //     caption,
      //     footer,
      //     messageFromAI,
      //   }) {
      //     yield (
      //       <BotCard>
      //         <div className="flex flex-row items-center">
      //           <SpinnerMessage />{" "}
      //           <p className="text-slate-500 text-sm">Rendering table...</p>
      //         </div>
      //       </BotCard>
      //     );

      //     return (
      //       <BotCard>
      //         <p>{messageFromAI}</p>
      //         <GenericTable
      //           columns={columns}
      //           data={data}
      //           caption={caption}
      //           footer={footer}
      //         />
      //       </BotCard>
      //     );
      //   },
      //   parameters: z.object({
      //     messageFromAI: z.string(),
      //     data: z
      //       .array(
      //         z.object({
      //           col1: z.string(),
      //           col2: z.string(),
      //           col3: z.string().optional(),
      //           col4: z.string().optional(),
      //           col5: z.string().optional(),
      //         })
      //       )
      //       .describe("The data to show in the table. This is a dynamic field"),
      //     columns: z.array(
      //       z.object({
      //         Header: z.string(),
      //         accessor: z.string(),
      //         headerClassName: z.string().optional(),
      //         cellClassName: z.string().optional(),
      //       })
      //     ),
      //     caption: z.string(),
      //     footer: z.array(
      //       z.object({
      //         colSpan: z.number(),
      //         content: z.string(),
      //         className: z.string().optional(),
      //       })
      //     ),
      //   }),
      // },
      addConnection: addConnectionTool(),
    },
    temperature: 0.5,
    onFinish: async ({ usage }) => {
      const { promptTokens, completionTokens, totalTokens } = usage;

      await updateSessionUsage(session._id as Id<"sessions">, totalTokens);

      console.log("Prompt tokens:", promptTokens);
      console.log("Completion tokens:", completionTokens);
      console.log("Total tokens:", totalTokens);
    },
  });

  return {
    id: nanoid(),
    display: result.value,
  };
}

export type AIState = Omit<Doc<"sessions">, "_id" | "_creationTime" | "key"> & {
  _id?: Doc<"sessions">["_id"];
  _creationTime?: Doc<"sessions">["_creationTime"];
  key?: Doc<"sessions">["key"];
};

export type UIState = {
  sessionId: string;
  display: React.ReactNode;
}[];

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage,
  },
  initialUIState: [],
  initialAIState: undefined,

  onGetUIState: async () => {
    "use server";

    const history = getAIState();

    if (history) {
      const uiState = await getUIStateFromAIState(history as Chat);
      return uiState;
    }
  },

  onSetAIState: async ({ state, done }) => {
    "use server";

    const { getToken } = auth();
    const token = await getToken({
      template: "convex",
    });

    if (!token) {
      throw new Error("User not found");
    }

    // await retryAsync(async () => {
    //   console.log(
    //     "Updating session | Inside onSetAIState retryAsync",
    //     state?._id,
    //     state?.messages.length
    //   );
    //   await updateSession(state?._id as Id<"sessions">, state?.messages || []);
    // }, 3);
  },
});

export const maxDuration = 300;
export const getUIStateFromAIState = async (history: Chat) => {
  return history.messages
    .filter((message) => message.role !== "system")
    .map((message, index) => ({
      sessionId: history._id,
      display: renderMessageDisplay(message),
    }));
};

const renderMessageDisplay = (message: Message) => {
  switch (message.role) {
    case "tool":
      return renderToolMessage(message.content);
    case "user":
      if ((message.content as string).includes("UIResponseConfirm")) {
        return (
          <BotCard showAvatar={false}>
            <ConfirmationPromptServer
              promptText={(message.content as string)
                .split(",")[1]
                .replace("OriginalPrompt: ", "")}
              selected={"confirm"}
            />
          </BotCard>
        );
      } else if ((message.content as string).includes("UIResponseCancel")) {
        return (
          <BotCard showAvatar={false}>
            <ConfirmationPromptServer
              promptText={(message.content as string)
                .split(",")[1]
                .replace("OriginalPrompt: ", "")}
              selected={"cancel"}
            />
          </BotCard>
        );
      } else if (
        (message.content as string).includes('"type":"form_submission"')
      ) {
        const formSubmission = JSON.parse(message.content as string);
        return (
          <UserMessage>
            <div className="flex flex-col gap-2">
              <div className="mb-2 text-sm font-bold">Form Snapshot:</div>
              <DynamicForm
                fields={formSubmission.fields.map(
                  (field: { name: string; [key: string]: any }) => ({
                    ...field,
                    value: formSubmission.formData[field.name],
                  })
                )}
                toolCallId="submitted-form"
                isSubmitted={true}
                submittedData={formSubmission.formData}
              />
            </div>
          </UserMessage>
        );
      }
      return <UserMessage>{message.content as string}</UserMessage>;
    case "assistant":
      return renderAssistantMessage(message);
    default:
      return (
        <BotCard>
          <Badge variant="outline">Action call made.</Badge>
        </BotCard>
      );
  }
};

const renderAssistantMessage = (message: Message) => {
  if (typeof message.content === "string") {
    return <BotMessage content={message.content} />;
  }

  if (Array.isArray(message.content as AssistantContent)) {
    return message.content.map((item) => {
      if (
        item.type === "tool-call" &&
        item.toolName === "getUserConfirmation"
      ) {
        return (
          <BotCard key={item.toolCallId}>
            <ConfirmationPromptServer
              promptText={(item.args as any)?.message}
              hideButtons
            />
          </BotCard>
        );
      } else if (item.type === "tool-call" && item.toolName === "loadData") {
        return (
          <BotCard key={item.toolCallId}>
            <div className="flex flex-row gap-2 w-fit items-center px-3 py-2 text-xs border border-input bg-background p-1 rounded-sm">
              Attempted to load data into the knowledge base.
            </div>
          </BotCard>
        );
      } else if (item.type === "tool-call" && item.toolName === "updateData") {
        return (
          <BotCard key={item.toolCallId}>
            <div className="flex flex-row gap-2 w-fit items-center px-3 py-2 text-xs border border-input bg-background p-1 rounded-sm">
              Attempted to update data.
            </div>
          </BotCard>
        );
      } else if (item.type === "tool-call" && item.toolName === "createData") {
        return (
          <BotCard key={item.toolCallId}>
            <div className="flex flex-row gap-2 w-fit items-center px-3 py-2 text-xs border border-input bg-background p-1 rounded-sm">
              Attempted to create data.
            </div>
          </BotCard>
        );
      } else if (
        item.type === "tool-call" &&
        item.toolName === "createCustomUI"
      ) {
        return (
          <BotCard key={item.toolCallId}>
            <LoadingPromptServer
              loadedMessage="Your app is ready"
              loaded
            />
          </BotCard>
        );
      }

      // handle dynamic form
      if (item.type === "tool-call" && item.toolName === "renderDynamicForm") {
        return (
          <BotCard key={item.toolCallId}>
            <div className="flex flex-row gap-2 w-fit items-center px-3 py-2 text-xs border border-input bg-background p-1 rounded-sm">
              Attempted to render a dynamic form.
            </div>
          </BotCard>
        );
      }

      if (item.type === "tool-call" && item.toolName === "addConnection") {
        return (
          <BotCard key={item.toolCallId}>
            <div className="flex flex-row gap-2 w-fit items-center px-3 py-2 text-xs border border-input bg-background p-1 rounded-sm">
              Attempted to add a connection.
            </div>
          </BotCard>
        );
      }

      // Handle other types of content as needed
      return (
        <BotCard key={"not-found"}>
          <Badge variant="outline">Unhandled assistant message format</Badge>
        </BotCard>
      );
    });
  }

  return (
    <BotCard>
      <Badge variant="outline">Unhandled assistant message format</Badge>
    </BotCard>
  );
};

const renderToolMessage = (content: ToolResultPart[]) => {
  return content.map((tool) => {
    switch (tool.toolName) {
      case "loadData":
        return (
          <BotCard showAvatar={false}>
            <LoadingPromptServer
              loaded
              loadedMessage="Data added to Knowledge Base"
            />
          </BotCard>
        );
      case "updateData":
      case "createData":
        return (
          <BotCard showAvatar={false}>
            {tool.isError ? (
              <>
                <LoadingPromptServer
                  loaded
                  loadedMessage="Failed to update data."
                  state="loaded-error"
                />
                <Markdown
                  content={
                    "```json\n" +
                    safeJSON.stringify(
                      tool?.result as string | Record<string, any>,
                      null,
                      2
                    ) +
                    "\n```"
                  }
                />
              </>
            ) : (
              <LoadingPromptServer
                loaded
                loadedMessage={
                  tool.toolName === "updateData"
                    ? "Data updated."
                    : "Data created."
                }
              />
            )}
          </BotCard>
        );
      case "createCustomUI":
        return (
          <BotCard showAvatar={false}>
            <ServerControlledCodeEditorWithAI
              code={(tool.result as any)?.code || ""}
              appId={(tool.result as any)?.appId}
            />
            {/* <DynamicServerComponent
              code={(tool.result as any)?.code || ""}
              description={(tool.result as any)?.description}
              title={(tool.result as any)?.title}
              prompt={(tool.result as any)?.prompt}
              addOrRemove="add"
            /> */}
          </BotCard>
        );
      case "getUserConfirmation":
        return (
          <BotCard>
            <ConfirmationPromptServer
              promptText={(tool.result as any)?.message}
              hideButtons={true}
            />
          </BotCard>
        );
      case "renderDynamicForm":
        return null;
      default:
        return null;
    }
  });
};

const availableTools = [
  "loadData",
  "createData",
  "updateData",
  "createCustomUI",
  "renderTable",
  "renderDynamicForm",
  "showTable",
  "addConnection",
] as const;

export type Tool = (typeof availableTools)[number];
