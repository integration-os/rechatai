"use client";

import { getDomain } from "@/lib/utils";
import { useAuth, useOrganization } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { useAuthKit } from "@integrationos/authkit";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useEffect, useState } from "react";
import { completeOnboarding } from "@/app/onboarding/_actions";
import { useUser } from "@clerk/nextjs";
import jwtDecode from "jwt-decode";

export const useOpenOnboardingAuthKitUx = () => {
  const { getToken, userId } = useAuth();
  const storeConnection = useMutation(api.connections.storeConnection);
  const { organization } = useOrganization();
  const { theme } = useTheme();
  const [title, setTitle] = useState<string>();
  const [token, setToken] = useState<string | null>(null);
  const { user } = useUser();

  const { open } = useAuthKit({
    selectedConnection: title,
    token: {
      url: `${getDomain()}/api/auth-kit`,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
    appTheme: theme as "light" | "dark",
    onSuccess: async (connection) => {

      const _token = await getToken({
        template: "convex",
      });

      if (userId && _token) {

        const decodedToken = jwtDecode<any>(_token);
        const ownerId = decodedToken.iss + "|" + decodedToken.sub;

        const connectionRecord = {
          userId,
          key: connection?.key,
          platform: connection?.platform,
          organizationId: organization?.id,
          ownerId,

        };
        await storeConnection(connectionRecord);
        try {
          const result = await completeOnboarding();
          if (result.success) {
            await user?.reload();
            window.location.href = "/chat";
          }
        } catch (error) {
          console.error("Failed to complete onboarding:", error);
        }
      }
    },
  });

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const newToken = await getToken({
          template: "convex",
        });
        setToken(newToken);
      } catch (error) {
        console.error("Failed to get token:", error);
      }
    };

    !token && fetchToken();

    if (title && token) {
      open();
    }
  }, [title, token, getToken]); // Added token to dependencies

  const trigger = (title: string) => {
    setTitle(title);
  };

  return { trigger };
};
