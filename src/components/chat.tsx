"use client";

import { useEffect, useState } from "react";
import { ChatPanel } from "./ai/chat-panel";
import { useScrollAnchor } from "../lib/hooks/use-scroll-anchor";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useAIState, useUIState } from "ai/rsc";
import { useLocalStorage } from "../lib/hooks/use-local-storage";
import { Message } from "../lib/types";
import { ChatList } from "./chat-list";
import { EmptyScreen } from "./empty-screen";
import { cn } from "../lib/utils";
import { ScrollArea } from "./ui/scroll-area";
import { AI } from "../lib/chat/actions";

export interface ChatProps extends React.ComponentProps<"div"> {
  initialMessages?: Message[];
  sessionId?: string;
}

export const Chat = ({ className, sessionId }: ChatProps) => {
  const [input, setInput] = useState("");
  const [messages] = useUIState();
  const [aiState, setAiState] = useAIState<typeof AI>();

  const path = usePathname();

  const { messagesRef, scrollRef, visibilityRef, scrollToBottom } =
    useScrollAnchor();

  useEffect(() => {
    const messagesLength = aiState.messages?.length;
    if (messagesLength > 2) {
      scrollToBottom();
    }
  }, [aiState.messages]);

  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    if (!visibilityRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1, // Trigger when at least 10% of the target is visible
      }
    );

    observer.observe(visibilityRef.current);

    return () => {
      if (visibilityRef.current) {
        observer.unobserve(visibilityRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (aiState._id && path?.includes("chat") && messages.length === 2) {
      window.history.replaceState({}, "", `/chat/${aiState._id}`);
    }
  }, [aiState._id, path, messages.length]);

  return (
    <ScrollArea className="h-[calc(100vh-105px)]">
      <div
        className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]"
        ref={scrollRef}
      >
        <div
          className={cn("pb-[200px] pt-4 md:pt-10", className)}
          ref={messagesRef}
        >
          {messages.length ? (
            <ChatList messages={messages} isShared={false} />
          ) : (
            <EmptyScreen />
          )}
        </div>

        <ChatPanel
          sessionId={sessionId}
          input={input}
          setInput={setInput}
          isAtBottom={isFooterVisible}
          scrollToBottom={scrollToBottom}
        />
      </div>
      <div className="w-full h-px" ref={visibilityRef} />
    </ScrollArea>
  );
};


