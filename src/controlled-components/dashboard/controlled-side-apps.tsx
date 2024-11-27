"use client";
import React, { useCallback } from "react";
import { usePathname } from "next/navigation";
import { SidePanel } from "../../components/apps/side-panel";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ControlledConnections } from "../ControlledConnections";
import { ChatSessions } from "../../components/chat/ChatSessions";
import { Doc } from "../../../convex/_generated/dataModel";
import { AppTemplates } from "@/components/chat/AppTemplates";

interface ControlledSideAppsProps {}



const ControlledSideApps: React.FC<ControlledSideAppsProps> = () => {
  const apps = useQuery(api.apps.getAppsByOwnerId, {});
  const pathname = usePathname();

  const deleteApp = useMutation(api.apps.removeApp);

  if (!apps) {
    return <div>Loading...</div>;
  }



  return (
    <>
      <ControlledConnections />
      {pathname === "/dashboard" && (
        <SidePanel
          apps={apps}
          onDeleteClick={(id) => deleteApp({ id })}
          onAddClick={() => {}}
        />
      )}
      {pathname?.includes("/chat") && <AppTemplates />}
      {pathname?.includes("/chat") && <ChatSessions />}
    </>
  );
};

export default ControlledSideApps;
