import { useMutation } from "@tanstack/react-query";

import { createCustomerApi } from "@/endpoints/stripe";

export const useCreateCustomer = () => {
  const mutation = useMutation({
    mutationFn: ({ name, email }: { name: string; email?: string }) =>
      createCustomerApi({
        name,
        email,
      }),
  });

  return {
    trigger: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
};
