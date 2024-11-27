import useGetSubscription from "@/hooks/useGetSubscription";
import { Billing } from "@/components/settings/Billing";
import useGetProduct from "@/hooks/useGetProduct";
import { useCreateBillingPortalSessionUx } from "@/hooks/ux/useCreateBillingPortalSessionUx";
import { PaymentMethods } from "@/components/settings/PaymentMethods";
import useListPaymentMethods from "@/hooks/useListPaymentMethods";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingState = () => (
  <div className="border rounded-md p-2">
    {[...Array(3)].map((_, index) => (
      <Skeleton key={index} className="h-[60px] my-2 w-full" />
    ))}
  </div>
);

export const ControlledBillingSection = () => {
  const { data: subscription, isLoading: isLoadingSubscription } =
    useGetSubscription();

  const { data: product, isLoading: isLoadingProduct } = useGetProduct();

  const { data: paymentMethods, isLoading: isLoadingPaymentMethods } =
    useListPaymentMethods();

  const cards = paymentMethods?.data?.map((paymentMethod) => ({
    brand: paymentMethod?.card?.brand,
    expiryMonth: paymentMethod?.card?.exp_month,
    expiryYear: paymentMethod?.card?.exp_year,
    last4: paymentMethod?.card?.last4,
    funding: paymentMethod?.card?.funding,
  }));

  const {
    trigger: createBillingPortalSession,
    isLoading: isLoadingBillingPortalSession,
  } = useCreateBillingPortalSessionUx();

  return (
    <div className="grid mx-3">
      {subscription &&
        product &&
        !isLoadingSubscription &&
        !isLoadingProduct &&
        !isLoadingBillingPortalSession && (
          <Billing
            amount={subscription?.plan?.amount}
            currentPeriodStart={subscription?.current_period_start}
            currentPeriodEnd={subscription?.current_period_end}
            planName={product?.name}
            onClickManageBilling={createBillingPortalSession}
          />
        )}

      {(isLoadingSubscription ||
        isLoadingProduct ||
        isLoadingBillingPortalSession ||
        !subscription ||
        !product) && <LoadingState />}

      <div className="pt-6">
        {!isLoadingPaymentMethods && !isLoadingBillingPortalSession && paymentMethods && (
          <PaymentMethods onClick={createBillingPortalSession} cards={cards} />
        )}
        {(isLoadingPaymentMethods || isLoadingBillingPortalSession || !paymentMethods) && (
          <LoadingState />
        )}
      </div>
    </div>
  );
};
