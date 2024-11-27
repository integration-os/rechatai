import { Invoices } from "@/components/settings/Invoices";
import { Skeleton } from "@/components/ui/skeleton";
import useListInvoices from "@/hooks/useListInvoices";

const LoadingState = () => (
  <div className="border rounded-md p-2 mx-3">
    {[...Array(10)].map((_, index) => (
      <Skeleton key={index} className="h-[60px] my-2 w-full" />
    ))}
  </div>
);

export const ControlledInvoicesSection = () => {
  const { data, isLoading: isLoadingInvoices } = useListInvoices();

  const invoices = data?.data?.map((invoice) => ({
    amount: invoice.amount_due,
    createdAt: invoice.created,
    invoiceNumber: invoice.number,
    status: invoice.status as
      | "draft"
      | "open"
      | "paid"
      | "uncollectible"
      | "void",
    hostedInvoiceUrl: invoice.hosted_invoice_url,
    invoicePdf: invoice.invoice_pdf,
  }));

  return (
    <>
      {invoices && !isLoadingInvoices && (
        <div className="mx-3">
          <Invoices invoices={invoices} />
        </div>
      )}
      {(isLoadingInvoices || !invoices) && <LoadingState />}
    </>
  );
};
