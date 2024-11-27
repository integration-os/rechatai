"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

export type Payment = {
  id?: string;
  invoiceNumber?: string;
  total?: number;
  status?: string;
  fullName?: string;
  currency?: string;
  platform?: {
    image?: string;
    name?: string;
  };
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "id",
    header: "Order ID"
  },
  {
    accessorKey: "platform",
    header: () => <div>Platform</div>,
    cell: ({ row }) => {
      const platformName: string = row.getValue("platform");
      const platformImage = platformImages[platformName.toLowerCase()];
      return (
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={platformImage} alt={platformName} />
            <AvatarFallback>{platformName.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="font-small">{platformName}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const badgeClassName =
        row.getValue("status") === "completed"
          ? "bg-green-400 hover:bg-green-400"
          : row.getValue("status") === "confirmed"
          ? "bg-green-400 hover:bg-green-400"
          : row.getValue("status") === "processing"
          ? "bg-yellow-400 hover:bg-yellow-400"
          : row.getValue("status") === "voided"
          ? "bg-red-400 hover:bg-red-400"
          : row.getValue("status") === "deleted"
          ? "bg-red-400 hover:bg-red-400"
          : "bg-gray-400 hover:bg-gray-400";

      return (
        <Badge
          className={`py-0 px-1 rounded-sm text-xs font-medium ${badgeClassName}`}
          style={{ fontSize: "0.7rem" }}
        >
          {row.getValue("status")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "items",
    header: () => <div>Items</div>,
    cell: ({ row }) => {
      const items = (row.getValue("items") as any[]) || [];
      return <Badge className="font-small bg-blue-400 hover:bg-blue-400">{items.length}</Badge>;
    },
  },
  {
    accessorKey: "subTotal",
    header: () => <div>Sub Total</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("subTotal"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: row.original.currency || "usd",
      }).format(amount);

      return <div className="font-small">{formatted}</div>;
    },
  },
  {
    accessorKey: "total",
    header: () => <div>Total</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: row.original?.currency || "usd",
      }).format(amount);

      return <div className="font-small">{formatted}</div>;
    },
  },
];

const platformImages: { [key: string]: string } = {
  shopify: "https://assets.buildable.dev/catalog/node-templates/shopify.svg",
  square: "https://assets.buildable.dev/catalog/node-templates/square.svg",
};
