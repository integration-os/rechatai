import { useQuery } from "@tanstack/react-query";
import { keys } from "@/endpoints";
import { getSubscriptionApi } from "@/endpoints/stripe";
import { useQuery as useConvexQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Subscription } from "@/types/stripe";

export default function useGetSubscription() {

  const client = useConvexQuery(
    api.clients.getClientByOwnerId);

  const { data, isLoading } = useQuery<Subscription>({
    queryKey: [keys["get.subscription"]],
    queryFn: () =>
      getSubscriptionApi({
        subscriptionId: client?.billing?.subscription?.id as string,
      }),
    staleTime: 5 * 60 * 1000,
    enabled: !!client?.billing?.subscription?.id,
  });

  return {
    data,
    isLoading,
  };
}
