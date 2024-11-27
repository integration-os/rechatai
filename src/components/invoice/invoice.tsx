"use client";

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Button } from "@nextui-org/react";

interface InvoiceProps {
  invoiceNumber: string;
  invoiceDate: string;
  items: Array<Items>;
  subtotal: number;
  tax: number;
  total: number;
  onPrint?: () => void;
  onPay?: () => void;
}

export interface Items {
  name: string;
  quantity: number;
  unitPrice: number;
}

export default function Invoice({
  invoiceNumber,
  invoiceDate,
  items,
  onPay,
  subtotal,
  total,
  onPrint,
  tax,
}: InvoiceProps) {
  return (
    <Card className="w-full max-w-4xl">
      <CardHeader className="grid gap-6 bg-gray-100 dark:bg-gray-800 p-6 rounded-t">
        <div className="grid gap-4">
          <div className="grid gap-1">
            <div className="text-gray-500 dark:text-gray-400">Invoice</div>
            <div className="font-bold text-2xl">{invoiceNumber}</div>
          </div>
          <div className="grid gap-1">
            <div className="text-gray-500 dark:text-gray-400">Date</div>
            <div>{invoiceDate}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 bg-white dark:bg-gray-950">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Unit Price</TableHead>
              <TableHead className="text-right">Line Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.unitPrice}</TableCell>
                <TableCell className="text-right">
                  {item.quantity * item.unitPrice}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardContent className="grid gap-4 p-6">
        <Separator className="my-6" />
        <div className="grid gap-4">
          <div className="grid grid-cols-2 items-center">
            <div className="text-gray-500 dark:text-gray-400">Subtotal</div>
            <div className="text-right font-medium">${subtotal.toFixed(2)}</div>
          </div>
          <div className="grid grid-cols-2 items-center">
            <div className="text-gray-500 dark:text-gray-400">Tax (10%)</div>
            <div className="text-right font-medium">${tax.toFixed(2)}</div>
          </div>
          <div className="grid grid-cols-2 items-center font-bold text-lg">
            <div>Total</div>
            <div className="text-right">${total.toFixed(2)}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-2 p-6">
        <Link
          href="#"
          className="text-sm font-medium hover:underline underline-offset-4"
          prefetch={false}
        >
          Need help?
        </Link>
        <div className="flex gap-2">
          <Button variant="bordered" onClick={onPrint}>
            Print
          </Button>
          <Button onClick={onPay}>Pay Now</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
