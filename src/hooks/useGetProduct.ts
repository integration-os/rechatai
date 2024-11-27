import { useQuery } from "@tanstack/react-query";

import useGetSubscription from "./useGetSubscription";

import { keys } from "@/endpoints";
import { getProductApi } from "@/endpoints/stripe";
import { Product } from "@/types/stripe";

export default function useGetProduct() {
  const { data: subscription } = useGetSubscription();

  const { data, isLoading } = useQuery<Product>({
    queryKey: [keys["get.product"]],
    queryFn: () =>
      getProductApi({
        productId: subscription?.plan?.product as string,
      }),
    staleTime: 5 * 60 * 1000,
    enabled: !!subscription?.plan?.product,
  });

  return {
    data,
    isLoading,
  };
}
