"use client";

import * as React from "react";
import Textarea from "react-textarea-autosize";
import _ from "lodash";
import { useActions, useUIState } from "ai/rsc";
import { useRouter } from "next/navigation";
import { AI } from "@/lib/chat/actions";
import { Button } from "@/components/ui/button";
import { IconArrowElbow, IconPlus } from "@/components/ui/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEnterSubmit } from "@/lib/hooks/use-enter-submit";
import { FailedMessage, UserMessage } from "@/components/ai/message";
import { spinner } from "./spinner";
import useGlobal from "../../hooks/useGlobal";
import useTracking from "@/hooks/useTracking";
import { trackingConsts } from "@/lib/tracking";

function getRandomErrorMessage(): string {
  const errorMessages = [
    "Our servers are experiencing higher than usual traffic. We're working on expanding capacity.",
    "It seems everyone wants to chat with our AI today. We're scaling up to meet the demand.",
    "Our servers are running a bit hot. We're adding more cooling power to handle the load.",
    "We're experiencing a temporary bottleneck. Our team is optimizing server throughput as we speak.",
    "Our AI is more popular than we anticipated. We're adding more processing power to keep up.",
    "We've hit peak usage hours. Our servers are working overtime to accommodate all requests.",
    "Our infrastructure is handling an unexpected surge in curiosity. We're expanding to match your enthusiasm.",
    "Looks like we're having a rush hour on our servers. We're opening more lanes to smooth out the traffic.",
    "Our AI is hosting a popular party and the servers are at capacity. We're setting up overflow rooms.",
    "We're experiencing the digital equivalent of a traffic jam. Our team is working on opening up more server highways.",
  ];

  const randomIndex = Math.floor(Math.random() * errorMessages.length);
  return errorMessages[randomIndex];
}

export function PromptForm({
  input,
  setInput,
}: {
  input: string;
  setInput?: (value: string) => void;
}) {
  const router = useRouter();
  const { formRef, onKeyDown } = useEnterSubmit();
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const { submitUserMessage } = useActions();
  const [, setMessages] = useUIState<typeof AI>();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [suggestions, setSuggestions] = useGlobal<string>(["suggestions", "selected"]);

  const { track } = useTracking();

  React.useEffect(() => {
    if (suggestions) {
      setInput && setInput(suggestions);
    }
  }, [suggestions]);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (window.innerWidth < 600) {
      (e.target as HTMLFormElement)["message"]?.blur();
    }

    const value = input.trim();
    if (!value) return;

    setInput && setInput("");
    await submitMessage(value);
    track(trackingConsts.CHAT.SENT_MESSAGE, { message: value });
  };

  const submitMessage = async (value: string, isRetry = false) => {
    setIsSubmitting(true);

    if (!isRetry) {
      addUserMessage(value, true);
    } else {
      updateLastMessageToLoading(value);
    }

    try {
      const responseMessage = await submitUserMessage(value);
      updateLastUserMessage(value, false);
      addResponseMessage(responseMessage);
    } catch (error) {
      console.error(error);
      updateLastMessageToError(value);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addUserMessage = (value: string, isLoading: boolean) => {
    setMessages((currentMessages: any) => [
      ...currentMessages,
      {
        display: (
          <UserMessage key={Date.now()} isLoading={isLoading}>
            {value}
          </UserMessage>
        ),
      },
    ]);
  };

  const updateLastMessageToLoading = (value: string) => {
    setMessages((currentMessages: any) => {
      const newMessages = [...currentMessages];
      newMessages[newMessages.length - 1] = {
        display: (
          <UserMessage key={Date.now()} isLoading>
            {value}
          </UserMessage>
        ),
      };
      return newMessages;
    });
  };

  const updateLastUserMessage = (value: string, isLoading: boolean) => {
    setMessages((currentMessages: any) => {
      const newMessages = [...currentMessages];
      newMessages[newMessages.length - 1] = {
        display: (
          <UserMessage key={Date.now()} isLoading={isLoading}>
            {value}
          </UserMessage>
        ),
      };
      return newMessages;
    });
  };

  const addResponseMessage = (responseMessage: any) => {
    setMessages((currentMessages: any) => [
      ...currentMessages,
      responseMessage,
    ]);
  };

  const updateLastMessageToError = (value: string) => {
    setMessages((currentMessages: any) => {
      const newMessages = [...currentMessages];
      newMessages[newMessages.length - 1] = {
        display: (
          <FailedMessage
            errorMessage={getRandomErrorMessage()}
            onRetry={() => submitMessage(value, true)}
          >
            {value}
          </FailedMessage>
        ),
      };
      return newMessages;
    });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-8 sm:rounded-md sm:border sm:px-12">
        <NewChatButton router={router} />
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          placeholder="Describe the app you're looking to build"
          className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          name="message"
          rows={1}
          value={input}
          onChange={(e) => {
            setInput && setInput(e.target.value);
            setSuggestions("");
          }}
        />
        <SendButton
          isDisabled={input === "" || isSubmitting}
          isSubmitting={isSubmitting}
        />
      </div>
    </form>
  );
}

function NewChatButton({ router }: { router: ReturnType<typeof useRouter> }) {

  const { track } = useTracking();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-[14px] size-8 rounded-full bg-background p-0 sm:left-4"
          onClick={() => {
            window.location.href = "/chat";
            track(trackingConsts.CHAT.CREATED_CHAT);
          }}
        >
          <IconPlus />
          <span className="sr-only">New Chat</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>New Chat</TooltipContent>
    </Tooltip>
  );
}

export function SendButton({
  isDisabled,
  isSubmitting,
}: {
  isDisabled: boolean;
  isSubmitting: boolean;
}) {
  return (
    <div className="absolute right-0 top-[13px] sm:right-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button type="submit" size="icon" disabled={isDisabled}>
            {isSubmitting ? spinner : <IconArrowElbow />}
            <span className="sr-only">Send message</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Send message</TooltipContent>
      </Tooltip>
    </div>
  );
}
