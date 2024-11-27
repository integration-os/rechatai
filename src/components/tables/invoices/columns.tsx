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
    accessorKey: "invoiceNumber",
    header: "Invoice Number",
    cell: ({ row }) => {
      return <div className="font-small">{row.getValue("invoiceNumber")}</div>;
    },
  },
  {
    accessorKey: "fullName",
    header: "Name",
    cell: ({ row }) => {
      return <div className="font-small">{row.getValue("fullName")}</div>;
    },
  },
  {
    accessorKey: "total",
    header: () => <div>Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: row.original.currency,
      }).format(amount);

      return <div className="font-small">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const badgeClassName =
        row.getValue("status") === "draft"
          ? "bg-gray-400 hover:bg-gray-400"
          : row.getValue("status") === "paid"
          ? "bg-green-400 hover:bg-green-400"
          : row.getValue("status") === "authorised"
          ? "bg-blue-400 hover:bg-blue-400"
          : row.getValue("status") === "submitted"
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
    accessorKey: "platform",
    header: () => <div>Platform</div>,
    cell: ({ row }) => {
      const platform: {
        image: string;
        name: string;
      } = row.getValue("platform");
      return (
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={platform.image} alt={platform.name} />
            <AvatarFallback>{platform.name?.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="font-small">{platform.name}</div>
        </div>
      );
    },
  },
];
