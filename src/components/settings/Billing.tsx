import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import _ from "lodash";
import { formatAmount, formatDate } from "@/lib/utils";

interface IProps {
  amount: number;
  currentPeriodEnd: number;
  currentPeriodStart: number;
  planName: string;
  onClickManageBilling: () => void;
}

export const Billing = ({
  amount,
  currentPeriodEnd,
  currentPeriodStart,
  planName,
  onClickManageBilling,
}: IProps) => {
  const formattedPeriod = `${formatDate(currentPeriodStart)} - ${formatDate(currentPeriodEnd)}`;

  return (
    <Card className="bg-transparent border">
      <CardHeader>
        <CardTitle className="flex flex-row w-full justify-between">
          <h2>{_.startCase(planName)} Plan</h2>
        </CardTitle>
      </CardHeader>
      <CardContent className="border-t py-4 flex flex-col w-full gap-2">
        <h2 className="font-semibold text-lg">Current Billing Cycle</h2>
        <p className="text-sm">{formattedPeriod}</p>
        <hr className="my-4" />
        <h2 className="font-semibold text-lg">
          Total Due ${formatAmount(amount)}
        </h2>
      </CardContent>
      <CardFooter className="border-t px-6 py-4  flex flex-row justify-between items-center">
        <Button onClick={onClickManageBilling} size="xs">
          Manage Plan
        </Button>
        <div className="flex flex-row gap-2 items-center">
          <p className="text-sm text-foreground/50">Custom needs?</p>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => {
              window.open("https://calendly.com/d/42p-4nv-74c", "_blank");
            }}
          >
            Contact Sales
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
