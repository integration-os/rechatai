import { Separator } from "@/components/ui/separator";
import { UIState } from "@/lib/chat/actions";
import Link from "next/link";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export interface ChatList {
  messages: UIState;
  isShared: boolean;
  ref?: React.RefObject<HTMLDivElement>;
}

export function ChatList({ messages, ref }: ChatList) {

  if (!messages.length) {
    return null;
  }

  return (
    <div className="relative mx-auto md:max-w-4xl lg:max-w-4xl xl:max-w-5xl flex flex-col gap-2" ref={ref}>
      {messages.map((message, index) => (
        <div key={message.sessionId + "-" + index}>
          {message.display}
          {index < messages.length - 1 && <div className="my-4" />}
        </div>
      ))}
    </div>
  );
}
