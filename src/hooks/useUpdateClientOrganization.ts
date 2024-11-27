import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useOrganization, useUser } from "@clerk/nextjs";

export const useUpdateClientOrganization = () => {
  const _update = useMutation(api.clients.updateClientOrganization);
  const { user } = useUser();
  const _client = useQuery(
    api.clients.getClientByUserId,
    user ? { userId: user.id } : "skip"
  );
  const { organization } = useOrganization();

  const trigger = async () => {

    try {
      if (organization && _client && !_client.organizationId) {
        await _update({
          organizationId: organization.id,
        });
      }
    } catch (error) {
      console.error("Error updating client organization:", error);
    }
  };

  return { trigger };
};
