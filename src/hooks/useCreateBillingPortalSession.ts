import { useMutation } from "@tanstack/react-query";

import { createBillingPortalSessionApi } from "@/endpoints/stripe";
import getEnvFromHost from "@/lib/utils";

const urls = {
  localhost: "http://localhost:3000/onboarding/pricing",
  development: "https://development.rechatai.com/onboarding/pricing",
  production: "https://app.rechatai.com/onboarding/pricing",
};

export const useCreateBillingPortalSession = () => {
  const env = getEnvFromHost();

  const returnUrl = env ? urls[env] : urls.development;

  const mutation = useMutation({
    mutationFn: ({ customerId }: { customerId: string }) =>
      createBillingPortalSessionApi({
        customerId,
        returnUrl,
      }),
  });

  return {
    trigger: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
};
