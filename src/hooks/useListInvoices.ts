import { useQuery } from "@tanstack/react-query";
import { keys } from "@/endpoints";
import { listInvoicesApi } from "@/endpoints/stripe";
import { InvoiceList } from "@/types/stripe";
import { useQuery as useConvexQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function useListInvoices() {

  const client = useConvexQuery(
    api.clients.getClientByOwnerId);

  const { data, isLoading } = useQuery<InvoiceList>({
    queryKey: [keys["list.invoices"]],
    queryFn: () =>
      listInvoicesApi({
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
