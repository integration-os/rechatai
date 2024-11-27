"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect } from "react";
import { useCreateUserUx } from "@/hooks/ux/useCreateUserUx";
import { useUpdateClientOrganization } from "@/hooks/useUpdateClientOrganization";
import { useCreateClientUx } from "@/hooks/ux/useCreateClientUx";

export const ControlledUser = () => {
  const { user } = useUser();
  const { organization } = useOrganization();

  const { trigger: updateClient } = useUpdateClientOrganization();
  const { trigger: createClient } = useCreateClientUx();

  const _user = useQuery(
    api.users.getUserById,
    user ? { id: user.id } : "skip"
  );

  const client = useQuery(
    api.clients.getClientByUserId,
    user ? { userId: user.id } : "skip"
  );

  const { trigger } = useCreateUserUx();

  useEffect(() => {
    if (_user === null) {
      trigger();
    }
  }, [_user]);

  useEffect(() => {
    if (client === null && _user) {
      createClient();
    }
  }, [client, _user]);

  useEffect(() => {
    if (_user && client && organization) {
      updateClient();
    }
  }, [organization, _user, client]);

  return <></>;
};
