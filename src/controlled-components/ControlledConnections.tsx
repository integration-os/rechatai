"use client";
import { ConnectionsComponent } from "@/components/chat/Connections";
import useGlobal from "@/hooks/useGlobal";
import { useDeleteConnectionUx } from "@/hooks/ux/useDeleteConnectionUx";
import { useOpenAuthKitUx } from "@/hooks/ux/useOpenAuthKitUx";
import { useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../convex/_generated/api";
import { ChatSessions } from "../components/chat/ChatSessions";

export const ControlledConnections = () => {
  const { trigger } = useOpenAuthKitUx();

  const connections = useQuery(api.connections.listConnections);

  const [isOpen, setIsOpen] = useState(false);

  const { trigger: deleteConnection, isLoading: isDeleting } =
    useDeleteConnectionUx(setIsOpen);

  const [, setConnectionId, { resetKey }] = useGlobal([
    "connection",
    "selected",
  ]);

  if (!isOpen) {
    resetKey();
  }

  return (
    <>
      <ConnectionsComponent
        onDeleteConnection={deleteConnection}
        connections={connections}
        onClick={trigger}
        isDeleting={isDeleting}
        isLoading={!connections}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setConnectionId={setConnectionId}
      />
    </>
  );
};
