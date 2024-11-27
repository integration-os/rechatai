import { AppTemplate } from "@/types/appTemplate";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Connection } from "@/types/connections";
import { useState } from "react";
import { useAuth, useOrganization } from "@clerk/nextjs";
import { fetchMutation } from "convex/nextjs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useTracking from "@/hooks/useTracking";
import { trackingConsts } from "@/lib/tracking";

async function createInitialApp({
  title,
  description,
  code,
  prompt,
  platformsUsed,
  token,
  organizationId,
}: {
  title: string;
  description: string;
  code: string;
  prompt: string;
  platformsUsed: {
    platform: string;
    connectionKey: string;
    models: string[];
  }[];
  token: string;
  organizationId?: string;
}) {
  return await fetchMutation(
    api.appVersions.createAppVersion,
    {
      title,
      description,
      code,
      prompt,
      platformsUsed,
      organizationId,
      name: title.toLowerCase().replace(/\s/g, "-"),
      version: "1",
    },
    { token }
  );
}

function getUnconnectedPlatforms(
  platformsUsed?: {
    platform: string;
    connectionKey: string;
    models: string[];
  }[],
  connections?: Connection[]
): string[] {
  const connectedPlatforms = connections?.map(
    (connection) => connection.platform
  );
  return (
    platformsUsed
      ?.filter(
        (platformUsed) => !connectedPlatforms?.includes(platformUsed.platform)
      )
      .map((platformUsed) => platformUsed.platform) || []
  );
}

export const useOnClickAppTemplateUx = () => {
  const connections = useQuery(api.connections.listConnections);

  const { organization } = useOrganization();

  const { getToken } = useAuth();

  const router = useRouter();

  const [unconnectedPlatforms, setUnconnectedPlatforms] = useState<string[]>(
    []
  );

  const { track } = useTracking();

  const trigger = async (appTemplate: AppTemplate) => {
    try {
      const platformsUsed = appTemplate.platformsUsed;

      const unconnectedPlatforms = getUnconnectedPlatforms(
        platformsUsed,
        connections
      );

      if (unconnectedPlatforms.length > 0) {
        setUnconnectedPlatforms(unconnectedPlatforms);
      } else {
        setUnconnectedPlatforms([]);
        const connectionKeyMap: Record<string, string> = {};
        connections?.forEach((connection) => {
          if (!connectionKeyMap[connection.platform]) {
            connectionKeyMap[connection.platform] = connection.key;
          }
        });

        // Replace the connection keys in the code and platformsUsed array
        const updatedPlatformsUsed = platformsUsed?.map((platformUsed) => {
          const connectionKey = connectionKeyMap[platformUsed.platform];
          return {
            ...platformUsed,
            connectionKey: connectionKey,
          };
        });

        // Update the code with the new connection keys
        const updatedCode = updatedPlatformsUsed?.reduce(
          (code, platformUsed) => {
            return code.replace(
              `connection_key_${platformUsed.platform}`,
              platformUsed.connectionKey
            );
          },
          appTemplate.code
        );

        const token = await getToken({
          template: "convex",
        });

        if (token === null) {
          throw new Error("Unauthenticated call");
        }

        const app = await createInitialApp({
          title: appTemplate.title,
          description: appTemplate.description || "",
          code: updatedCode || "",
          prompt: appTemplate.prompt,
          platformsUsed: updatedPlatformsUsed || [],
          organizationId: organization?.id,
          token,
        });
        
        window.location.href = "/dashboard";

        toast("App template created", {
          description: "The app template has been successfully created",
          action: {
            label: "Close",
            onClick: () => {
              toast.dismiss();
            },
          },
        });

        track(trackingConsts.APP_TEMPLATES.ADDED_TEMPLATE, { app });

      }
    } catch (error) {
      console.error(error);
    }
  };

  return {
    trigger,
    unconnectedPlatforms,
  };
};
