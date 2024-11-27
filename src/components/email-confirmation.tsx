import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Markdown } from "./ui/markdown";

export interface EmailConfirmationProps {
  from: string;
  to: string;
  subject: string;
  date: string;
  discountMessage: string;
  discountCode: string;
  discountAmount: string;
  emailContent: string;
}

export function EmailConfirmation({
  from,
  to,
  subject,
  date,
  discountMessage,
  discountCode,
  discountAmount,
  emailContent,
}: EmailConfirmationProps) {
  return (
    <Card className="sm:max-w-[725px]">
      <CardHeader>
        <CardTitle>Confirm Message</CardTitle>
        <CardDescription>
          Are you sure you want to send this message?
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border border-gray-200 rounded-lg p-4 dark:border-gray-800">
          <div className="flex items-start gap-4">
            <Avatar>
              <AvatarImage alt="@shadcn" src="/placeholder.svg" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="grid gap-1 items-start text-sm">
              <div className="flex items-center gap-2">
                <div className="font-bold">From:</div>
                <div>{from}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="font-bold">To:</div>
                <div>{to}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="font-bold">Subject:</div>
                <div>{subject}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="font-bold">Date:</div>
                <div>{date}</div>
              </div>
              <div>
                <p>
                  <div className="bg-gradient-to-r from-[#ff6b6b] to-[#ffa500] rounded-lg p-6 my-4 text-white font-bold text-2xl">
                    {discountMessage}
                  </div>
                  <div className="space-y-2">
                    <p>Hey {to.split(" ")[0]},</p>
                    {/* <Markdown content={emailContent}/> */}
                    <p>{emailContent}</p>
                    <div className="bg-gray-200 dark:bg-slate-600 p-2 rounded-md">
                      Use discount code{" "}
                      <span className="font-bold">{discountCode}</span> to get{" "}
                      {discountAmount} off your order.
                    </div>
                    <p>
                      Don&apos;t miss out on this great opportunity to save big!
                    </p>
                    <p>
                      Best regards,
                      <br />
                      The Acme Team
                    </p>
                  </div>
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="outline" className="mr-2">
          Cancel
        </Button>
        {/* <SendEmailButton
          from={from}
          to={to}
          subject={subject}
          date={date}
          discountMessage={discountMessage}
          discountCode={discountCode}
          discountAmount={discountAmount}
          emailContent={emailContent}
        /> */}
      </CardFooter>
    </Card>
  );
}
