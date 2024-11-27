import axios from "axios";
import { BillingPortalSession } from "@/types/stripe";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useCreateBillingPortalSession } from "../useCreateBillingPortalSession";
import { toast } from "sonner";

export const useCreateBillingPortalSessionUx = () => {
  const { trigger: createSession, isLoading } = useCreateBillingPortalSession();

  const client = useQuery(
    api.clients.getClientByOwnerId);

  const trigger = async () => {
    try {
      if (client?.billing?.customerId) {
        const session: BillingPortalSession = await createSession({
          customerId: client?.billing?.customerId,
        });

        if (session.url) {
          window.location.href = session.url;
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("Something went wrong", {
          description:
            "An error occurred while creating the billing portal session",
          action: {
            label: "Close",
            onClick: () => {
              toast.dismiss();
            },
          },
        });
      }
    }
  };

  return {
    trigger,
    isLoading,
  };
};
