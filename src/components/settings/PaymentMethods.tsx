import { CreditCard, Ellipsis, Trash } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import _ from "lodash";

interface IProps {
  onClick: () => void;
  cards?: {
    brand: string;
    expiryMonth: number;
    expiryYear: number;
    last4: string;
    funding: string;
  }[];
}

const EmptyState = () => (
    <div className="flex w-full justify-center items-center gap-3 flex-col rounded-md border border-divider p-6 shadow-small">
      <CreditCard color="gray" height={50} width={50} />
      <p className="text-default-500 text-sm">No payment method added</p>
    </div>
  );

export const PaymentMethods = ({ onClick, cards }: IProps) => {
  return (
    <Card className="bg-transparent border">
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
        <CardDescription className="pt-2">
          Payments for API calls, connections, and other usage are made using
          the default card.
        </CardDescription>
      </CardHeader>
      <CardContent className="border-t py-4">
        {cards && cards?.length === 0 && <EmptyState />}
        {cards && cards?.length > 0 && cards.map((card, index) => (
          <div
            key={index}
            className={`flex flex-row justify-between w-full items-center py-3 ${
                index === cards.length - 1 ? '' : 'border-b'
              }`}
          >
            <p className="text-sm text-default-600 items-center flex flex-row">
              <CreditCard
                className="mr-2"
                color="gray"
                height={20}
                width={20}
              />
              <span style={{ marginRight: "0.3rem" }}>
                {_.startCase(card?.brand)}
              </span>
              <span style={{ marginRight: "0.3rem" }}>{card?.funding}</span>
              <span style={{ marginRight: "0.3rem" }}>••••</span>
              <span>{card?.last4}</span>
            </p>
            <div className="flex flex-row gap-3 items-center">
              <p className="text-default-600 text-sm">
                Valid until {card?.expiryMonth}/{card?.expiryYear}
              </p>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Ellipsis cursor="pointer" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={onClick}>
                    <Trash className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="border-t py-4 justify-between flex flex-row items-center">
        <p className="text-default-600 text-sm w-[80%]">
          At most, three credit cards, debit cards or prepaid cards can be
          added.
        </p>
        <Button onClick={onClick} size="xs">Add Card</Button>
      </CardFooter>
    </Card>
  );
};
