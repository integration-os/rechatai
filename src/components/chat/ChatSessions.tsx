"use client";
import { CircleX, LucideIcon, Plus } from "lucide-react";
import { Nav } from "../nav";
import { useRouter } from "next/navigation";
import { Separator } from "../ui/separator";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Spinner } from "@nextui-org/react";
import { Button } from "../ui/button";
import { IconPlus } from "../ui/icons";
import { useState } from "react";
import { Dialog } from "../ui/dialog";
import { ModalComponent } from "../modal";
import { useDeleteSessionUx } from "@/hooks/ux/sessions/useDeleteSessionUx";
import Link from "next/link";
import useTracking from "@/hooks/useTracking";
import { trackingConsts } from "@/lib/tracking";

export const ChatSessions = () => {
  const sessions = useQuery(api.sessions.listSessions, {});
  const router = useRouter();

  const { isLoading, trigger } = useDeleteSessionUx();

  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState<string>();
  const { track } = useTracking();

  const deleteSession = async () => {
    await trigger({ session: session as string, setIsOpen });
  }

  if (!sessions) {
    return <Spinner />;
  }
  interface Link {
    title: string;
    label?: string;
    icon?: LucideIcon;
    variant: "default" | "ghost";
    href: string;
  }
  const links: Link[] =
    sessions?.page.map(
      (session) =>
        ({
          title: session.title,
          variant: "ghost",
          icon: CircleX,
          href: `/chat/${session._id}`,
          onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();
            setIsOpen(true);
            setSession(session._id);
          }
        }) as Link
    ) || [];

  return (
    <>
      <div className="flex flex-row w-full justify-between items-center px-4 py-3">
        <h1 className="text-md font-semibold">Chats</h1>
        <Button onClick={() => {
            window.location.href = "/chat";
            track(trackingConsts.CHAT.CREATED_CHAT);
          }} variant="outline" size="xs" asChild>
          <Link href="/chat">
            <Plus className="w-3 h-3 mr-1" />
            New chat
          </Link>
        </Button>
      </div>
      <Separator />
      <div className="flex-grow overflow-auto">
        <Nav links={links} />
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <ModalComponent
          isLoading={isLoading}
          loadingTitle="Deleting..."
          title="Delete chat Session"
          description="Are you sure you want to delete this chat session?"
          actionTitle="Delete"
          onClick={deleteSession}
        />
      </Dialog>
    </>
  );
};
