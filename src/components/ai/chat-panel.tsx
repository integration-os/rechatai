import * as React from "react";
import Image from "next/image";
import { shuffle } from "lodash";
import { useAIState, useActions, useUIState } from "ai/rsc";
import type { AI } from "@/lib/chat/actions";
import { nanoid } from "nanoid";
import { PromptForm } from "@/components/ui/prompt-form";
import { ButtonScrollToBottom } from "@/components/ui/button-scroll-to-bottom";
import { FooterText } from "../footer";
import { UserMessage } from "./message";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Alert, AlertDescription } from "../ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Slack } from "lucide-react";
import useTracking from "@/hooks/useTracking";
import { trackingConsts } from "@/lib/tracking";

// Move this outside the component to avoid recreating on each render
const allExampleMessages = [
  {
    platform: "attio",
    preview: "Create an Attio contacts dashboard",
    prompt: `Create an dashboard to visualize and manage Attio contacts.

**Key features:**
1. Display a table with columns for firstName, lastName, defaultEmail, and companyName.
2. Implement row click functionality to open a modal with a comprehensive form for updating the selected contact.
3. Add a prominent "Create New Contact" button at the top of the dashboard.
4. Ensure the contact form (for both update and create) is detailed and includes all relevant fields from the Attio contact model.
5. Implement proper error handling and validation for all form inputs.

Focus on creating a user-friendly interface with clear labels, intuitive layout, and responsive design. 
Ensure all CRUD operations (Create, Read, Update, Delete) are supported and properly integrated with the Attio API.`,
  },
  {
    platform: "openai",
    preview: "Generate an LLM output comparison app",
    prompt: `Build me an app to compare outputs of LLMs. It should have a field to enter a prompt and a button submit (which has a loading state when submitted). When the button is clicked, send the prompt to Openai gpt-4o-mini and Openai gpt-4o. It should return to me the output of the created messages from both LLMs and show me the 2 outputs side by side. Make sure to show a loading state when calling the AI. Remember to write a great system prompt. Pay extra special attention to the data structure of the chats common model.`,
  },
  {
    platform: "zendesk",
    preview: "Create a Zendesk ticket dashboard",
    prompt: `Create a dashboard to visualize and manage Zendesk tickets.

**Key features:**
1. Visible fields: title, status and priority.
2. Implement row click functionality to open a modal with a comprehensive form for updating the selected ticket.
3. Add a prominent "Create New Ticket" button at the top of the dashboard.
4. Ensure the ticket form (for both update and create) is detailed and includes all relevant fields from the tickets common model.
5. Implement proper error handling and validation for all form inputs.
6. Include filter options for the table for the status and priority fields.
7. Implement colorful badges for status and priority fields to enhance visual distinction and improve at-a-glance information processing.
`,
  },
  {
    platform: "rechat",
    preview: "Create a strong password generator",
    prompt: `Create a password generator that generates a password based on the user's input.

**Key features:**
1. Allow the user to select the length of the password.
2. Allow the user to select the number of words in the password.
3. Allow the user to select the number of numbers in the password.
4. Allow the user to select the number of symbols in the password.
5. Allow the user to select the number of uppercase letters in the password.
6. Allow the user to select the number of lowercase letters in the password.
`,
  },
  {
    platform: "rechat",
    preview: "Create a tailwind color palette generator",
    prompt: `Create an advanced Tailwind CSS Color Tool with the following features:

1. Color Management:
   - Add multiple base colors (name and HEX value)
   - Show default colors (Blue, Green, Red, Yellow, Purple)
   - Allow custom color addition
   - Select, copy, and remove colors
   - Persist colors in local storage
   - Include a visual color picker

2. Color Shade Generation:
   - Generate shades for selected color
   - Main color is 500 shade
   - Lighter shades: lower numbers (e.g., 100)
   - Darker shades: higher numbers (e.g., 900)
   - Balanced shade generation (not too light or dark)

3. Color Preview:
   - Show selected color and its shades
   - Click to copy shade HEX value

4. Tailwind Config Export:
   - Button to copy Tailwind CSS config
   - Include full shade object for selected color

5. User Experience:
   - Modern, responsive design

6. Additional Requirements:
   - Use appropriate UI components (Card, Input, Button, Label, etc.)
   - Graceful error handling (e.g., invalid color formats)
   - Ensure accessibility and cross-device compatibility
   - Implement shade calculation manually without relying on external libraries
   - Optimize performance for smooth user experience

Create a user-friendly interface that allows easy color management, shade generation, and Tailwind config export.`,
  },
];

export interface ChatPanelProps {
  input: string;
  setInput: (value: string) => void;
  isAtBottom: boolean;
  scrollToBottom: () => void;
  sessionId?: string;
}

export function ChatPanel({
  sessionId,
  input,
  setInput,
  isAtBottom,
  scrollToBottom,
}: ChatPanelProps) {
  const [messages, setMessages] = useUIState<typeof AI>();
  const [aiState, setAiState] = useAIState();

  const { submitUserMessage } = useActions();

  const { track } = useTracking();

  const session = useQuery(
    api.sessions.getSessionById,
    sessionId
      ? {
          id: sessionId as Id<"sessions">,
        }
      : "skip"
  );

  React.useEffect(() => {
    if (aiState) {
      setAiState({ ...aiState, sessionId });
    }
  }, [sessionId]);

  const [shuffledExamples, setShuffledExamples] = React.useState<
    typeof allExampleMessages
  >([]);

  React.useEffect(() => {
    setShuffledExamples(shuffle(allExampleMessages).slice(0, 4));
  }, []);

  return (
    <div className="absolute inset-x-0 bottom-[0px] w-full bg-gradient-to-b from-muted/30 from-0% to-muted/30 to-50% duration-300 ease-in-out animate-in dark:from-background/10 dark:from-10% dark:to-background/80 peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
      <ButtonScrollToBottom
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />

      <div className="mx-auto sm:max-w-2xl sm:px-4">
        {messages.length === 0 && (
          <div className="mb-4 mt-4 grid grid-cols-2 gap-2 px-4 sm:px-0">
            {shuffledExamples.map((example) => (
              <div
                key={example.platform}
                className="cursor-pointer rounded-lg border bg-white p-2 hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900 transition-colors duration-200 flex items-center justify-start text-left relative overflow-hidden spotlight-animation"
                onClick={async () => {
                  setMessages((currentMessages) => [
                    ...currentMessages,
                    {
                      sessionId: nanoid(),
                      display: <UserMessage>{example.prompt}</UserMessage>,
                    },
                  ]);

                  const responseMessage = await submitUserMessage(
                    example.prompt
                  );

                  setMessages((currentMessages) => [
                    ...currentMessages,
                    responseMessage,
                  ]);
                  track(trackingConsts.CHAT.SENT_MESSAGE, { message: example.prompt })
                }
              }
              >
                <div className="spotlight"></div>
                <Image
                  src={`https://assets.buildable.dev/catalog/node-templates/${example.platform}.svg`}
                  alt={example.platform}
                  width={24}
                  height={24}
                  className="mr-2 flex-shrink-0 relative z-10"
                />
                <div className="text-xs text-muted-foreground relative z-10">
                  {example.preview}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-4 bg-background rounded-xl p-4">
          {messages.length >= 1 ? (
            <div className="text-center space-y-3">
              <h3 className="text-xs text-muted-foreground font-semibold">
                Need help?
              </h3>
              <Link href="https://join.slack.com/t/rechat-ai/shared_invite/zt-2qkj8a0sw-EXOgHn9z_rioa2sRiDWngQ" target="_blank" className="flex items-center justify-center">
                <Button
                  variant="outline"
                  size="xs"
                  className="w-full"
                  
                >
                  <span>Post in #ask-an-expert</span>
                  <Slack className="w-4 h-4 ml-2"  />
                </Button>
                </Link>
            </div>
          ) : (
            <>
              <PromptForm input={input} setInput={setInput} />
              {(session?.usage?.totalTokens || 0) > 40_000 ? (
                <TokenWarning tokenCount={session?.usage?.totalTokens} />
              ) : (
                <FooterText className="hidden sm:block" />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const TokenWarning = ({ tokenCount }: { tokenCount: number | undefined }) => (
  <Alert variant="warning" className="">
    <ExclamationTriangleIcon className="h-4 w-4" />
    <AlertDescription className="text-xs ml-2">
      This conversation has grown quite long. For clearer responses and better
      results, especially when changing topics, consider starting a{" "}
      <Link href="/chat" className="underline ml-1 mr-1">
        fresh chat.
      </Link>
      New conversations help the Rechat focus better on your current questions.
    </AlertDescription>
  </Alert>
);
