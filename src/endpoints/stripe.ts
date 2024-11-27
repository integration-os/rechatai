import { getDomain } from "@/lib/utils";
import { api } from ".";

export const createCustomerApi = async ({
  name,
  email,
}: {
  name: string;
  email?: string;
}) =>
  api({
    method: "POST",
    payload: {
      name,
      email,
    },
    url: `${getDomain()}/api/stripe/create-customer`,
  });

export const getSubscriptionApi = async ({
  subscriptionId,
}: {
  subscriptionId: string;
}) =>
  api({
    method: "POST",
    url: `${getDomain()}/api/stripe/get-subscription`,
    payload: {
      subscriptionId,
    },
  });

export const getProductApi = async ({ productId }: { productId: string }) =>
  api({
    method: "POST",
    url: `${getDomain()}/api/stripe/get-product`,
    payload: {
      productId,
    },
  });

export const createBillingPortalSessionApi = async ({
  customerId,
  returnUrl,
}: {
  customerId: string;
  returnUrl: string;
}) =>
  api({
    method: "POST",
    payload: {
      customerId,
      returnUrl,
    },
    url: `${getDomain()}/api/stripe/create-billing-portal-session`,
  });

export const listPaymentMethodsApi = async ({
  customerId,
}: {
  customerId: string;
}) =>
  api({
    method: "POST",
    payload: {
      customerId,
    },
    url: `${getDomain()}/api/stripe/list-payment-methods`,
  });

export const listInvoicesApi = async ({ customerId }: { customerId: string }) =>
  api({
    method: "POST",
    payload: {
      customerId,
    },
    url: `${getDomain()}/api/stripe/list-invoices`,
  });

  