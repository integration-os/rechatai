"use client";

import React, { useEffect, useState } from "react";
import {
  AIVersion,
  CodeEditorWithAI,
} from "../components/ui/code-editor-with-ai";
import { changeCode } from "../app/actions/ai-code-assistant";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useOrganization } from "@clerk/nextjs";
import { toast } from "sonner";
import { Dialog } from "@/components/ui/dialog";
import { ModalComponent } from "@/components/modal";

export const ControlledCodeEditorWithAI = ({
  appId,
  code,
}: {
  appId?: Id<"apps">;
  code: string;
}) => {
  const app = useQuery(
    api.apps.getAppById,
    appId
      ? {
          id: appId,
        }
      : "skip"
  );

  const updateApp = useMutation(api.apps.updateApp);
  const [appToDelete, setAppToDelete] = useState<Doc<"apps"> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [_code, setInternalCode] = useState(code);

  const { organization } = useOrganization();

  const appVersions = useQuery(
    api.appVersions.listAppVersions,
    appId
      ? {
          appId,
        }
      : "skip"
  );

  const handleRemoveFromDashboard = () => {
    if (app) {
      setAppToDelete(app);
    }
  };

  const removeFromDashboard = async () => {
    if (appId) {
      setIsLoading(true);
      await updateApp({
        id: appId,
        isVisible: false,
      });

      setIsLoading(false);

      toast("App template removed from dashboard", {
        description: "The app template has been removed from your dashboard",
        action: {
          label: "Close",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
    }
  };

  const handleAddToDashboard = () => {
    if (appId) {
      updateApp({
        id: appId,
        isVisible: true,
      });

      toast("App template added to dashboard", {
        description: "The app template has been added to your dashboard",
        action: {
          label: "Close",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
    }
  };

  useEffect(() => {
    setInternalCode(app?.code || "");
  }, [app]);

  const createNewAppVersion = useMutation(api.appVersions.createAppVersion);

  return (
    <div className="flex flex-col gap-2">
      <CodeEditorWithAI
        aiProcessor={changeCode}
        isVisible={app?.isVisible}
        code={_code}
        handleRemoveFromDashboard={handleRemoveFromDashboard}
        handleAddToDashboard={handleAddToDashboard}
        appId={appId}
        onChange={(newVersion: AIVersion) => {
          appId &&
            createNewAppVersion({
              appId,
              userMessage: newVersion.message,
              aiExplanation: newVersion.explanation,
              platformsUsed: app?.platformsUsed,
              code: newVersion.code,
              organizationId: organization?.id,
              name: app?.name || "",
              prompt: app?.prompt || "",
              version: app?.version
                ? (parseInt(app.version) + 1).toString()
                : "1",
            });
        }}
        initialVersions={appVersions
          ?.map((version) => ({
            explanation: version.aiExplanation || "",
            code: version.code,
            message: version.userMessage || "",
          }))
          .reverse()}
      />
      <Dialog open={!!appToDelete} onOpenChange={() => setAppToDelete(null)}>
        <ModalComponent
          isLoading={isLoading}
          loadingTitle="Deleting..."
          title={`Delete app "${appToDelete?.title || "Untitled App"}"`}
          description="You're about to permanently delete an app. This action cannot be undone."
          actionTitle="Delete"
          onClick={removeFromDashboard}
        />
      </Dialog>
    </div>
  );
};
