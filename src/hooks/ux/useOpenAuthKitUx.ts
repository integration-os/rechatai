"use client";

import { getDomain } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { useAuthKit } from "@integrationos/authkit";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";

export const useOpenAuthKitUx = () => {
  const { getToken, userId } = useAuth();
  const storeConnection = useMutation(api.connections.storeConnection);
  const { theme } = useTheme();
  const [token, setToken] = useState<string | null>(null);

  const { open } = useAuthKit({
    token: {
      url: `${getDomain()}/api/auth-kit`,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
    appTheme: theme as "light" | "dark",
    onSuccess: async (connection) => {
      if (userId && token) {
        const decodedToken = jwtDecode<any>(token);
        const ownerId = decodedToken.iss + "|" + decodedToken.sub;

        const connectionRecord = {
          userId,
          key: connection?.key,
          platform: connection?.platform,
          organizationId: decodedToken.org_id ?? undefined,
          ownerId,
        };
        await storeConnection(connectionRecord);
      }
    },
  });

  useEffect(() => {
    if (token) {
      open();
    }
  }, [token]);

  const trigger = async () => {
    const _token = await getToken({
      template: "convex",
    });
    setToken(_token);
  };

  return { trigger };
};
