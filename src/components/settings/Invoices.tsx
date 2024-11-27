import { Ellipsis } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { format, fromUnixTime } from "date-fns";
import _ from "lodash";
import { formatAmount } from "@/lib/utils";
import { Badge } from "../ui/badge";

type InvoiceStatus = "draft" | "open" | "paid" | "uncollectible" | "void";

interface IProps {
  invoices: {
    createdAt: number;
    amount: number;
    status: InvoiceStatus;
    hostedInvoiceUrl: string;
    invoicePdf: string;
    invoiceNumber: string;
  }[];
}

const chipStyle = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-[#E6F4EA] text-[#106938] pointer-events-none"; // Light green background with dark green text
      case "draft":
        return "bg-[#FFF4E0] text-[#C87504] pointer-events-none"; // Light orange background with darker orange text
      case "open":
        return "bg-[#E0F0FF] text-[#1E5F91] pointer-events-none"; // Light blue background with darker blue text
      case "uncollectible":
        return "bg-[#FDECEA] text-[#A80000] pointer-events-none"; // Light red background with dark red text
      case "void":
        return "bg-[#FDECEA] text-[#A80000] pointer-events-none"; // Same as uncollectible
      case "default":
        return "bg-[#F3F3F3] text-[#6E6E6E] pointer-events-none"; // Light gray background with dark gray text
    }
  };
  

export const Invoices = ({ invoices }: IProps) => {
  return (
    <Card className="bg-transparent border">
      <CardHeader>
        <CardTitle>Invoices</CardTitle>
      </CardHeader>
      <CardContent className="grid">
        {invoices.map((invoice, index) => {
          const date = fromUnixTime(invoice.createdAt);
          const formattedDate = format(date, "MMMM yyyy");

          return (
            <div
              key={index}
              className={`flex items-center justify-between gap-4  py-4 ${
                index === invoices.length - 1 ? '' : 'border-b'
              }`}
            >
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">
                  {formattedDate}
                </p>
                <div className="flex flex-row gap-2">
                  <p className="text-sm text-muted-foreground">
                    {_.capitalize(invoice.invoiceNumber)}
                  </p>
                  <Badge
                  className={chipStyle(invoice.status)}
                  >{_.startCase(invoice.status)}</Badge>
                </div>
              </div>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">Total Due</p>
                <p className="text-sm">${formatAmount(invoice.amount)}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Ellipsis cursor="pointer" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => {
                      window.open(invoice.hostedInvoiceUrl, "_blank");
                    }}
                  >
                    <span>View Invoice</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      window.open(invoice.invoicePdf, "_blank");
                    }}
                  >
                    <span>Download PDF</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
