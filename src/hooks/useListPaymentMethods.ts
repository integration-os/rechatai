import { keys } from "@/endpoints";
import { listPaymentMethodsApi } from "@/endpoints/stripe";
import { PaymentMethodList } from "@/types/stripe";
import { useQuery as useConvexQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useQuery } from "@tanstack/react-query";

export default function useListPaymentMethods() {

  const client = useConvexQuery(
    api.clients.getClientByOwnerId);

  const { data, isLoading } = useQuery<PaymentMethodList>({
    queryKey: [keys["list.payment.methods"]],
    queryFn: () =>
      listPaymentMethodsApi({
        customerId: client?.billing?.customerId as string,
      }),
    staleTime: 5 * 60 * 1000,
    enabled: !!client?.billing?.customerId,
  });

  return {
    data,
    isLoading,
  };
}
