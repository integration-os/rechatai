import { useCreateCustomer } from "../useCreateCustomer";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import Stripe from "stripe";

export const useCreateClientUx = () => {
  const { trigger: createCustomer, isLoading } = useCreateCustomer();
  const storeClient = useMutation(api.clients.storeClient);
  const { user } = useUser();

  const trigger = async () => {
    const name =
      user?.fullName ||
      user?.username ||
      user?.emailAddresses?.[0]?.emailAddress ||
      "";

    const email = user?.emailAddresses?.[0]?.emailAddress || "";

    try {
      const response: {
        customer: Stripe.Response<Stripe.Customer>;
        subscription: Stripe.Response<Stripe.Subscription>;
      } = await createCustomer({
        name,
        email,
      });

      const billing = {
        provider: "stripe",
        customerId: response?.customer?.id,
        subscription: {
          id: response?.subscription?.id,
          endDate: response?.subscription?.current_period_end,
          key: "sub::free",
          valid: true,
        },
      };

      await storeClient({
        billing,
      });
    } catch (error) {
      console.error("Error creating customer:", error);
    }
  };

  return {
    trigger,
    isLoading,
  };
};
