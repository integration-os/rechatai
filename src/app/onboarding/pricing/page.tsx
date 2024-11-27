"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCreateBillingPortalSessionUx } from "@/hooks/ux/useCreateBillingPortalSessionUx";
import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Plan {
  name: string;
  price: number;
  description: string;
  billing: string;
  features: string[];
  cta: string;
  href?: string;
  variant?: "outline" | "default";
}

export default function Pricing(): JSX.Element {
  const { trigger, isLoading } = useCreateBillingPortalSessionUx();

  const plans: Plan[] = [
    {
      name: "Free",
      price: 0,
      description: "For developers and exploration",
      billing: "No credit card required",
      features: [
        "3 web apps",
        "30+ integrations",
        "Up to 3 users",
        "200 workflows / mo",
      ],
      cta: "Start Building",
      href: "/onboarding/connect",
      variant: "outline",
    },
    {
      name: "Team",
      price: 15,
      description: "For fast-moving, growing teams",
      billing: "Billed monthly",
      features: [
        "Unlimited web apps",
        "Share and publish apps",
        "No seat limits",
        "5,000 workflows / mo",
      ],
      cta: "Upgrade to Team",
    },
    {
      name: "Business",
      price: 65,
      description: "For teams who need more control",
      billing: "Billed monthly",
      features: [
        "20x higher message limits",
        "Audit logging",
        "Rich permission controls",
        "Custom branding",
      ],
      cta: "Upgrade to Business",
    },
  ];

  const getButtonStyles = (plan: Plan): string => {
    if (plan.variant === "outline") {
      return "w-full border-2 border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100";
    }
    return "w-full bg-gray-900 text-white hover:text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200";
  };

  const getFeatureHeader = (planName: string): string => {
    switch (planName) {
      case "Free":
        return "What's included:";
      case "Team":
        return "Everything in Free, plus:";
      case "Business":
        return "Everything in Team, plus:";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-start justify-start pt-8 relative overflow-hidden bg-gradient-to-r dark:bg-gradient-to-b dark:from-gray-950 dark:to-gray-900">
      {/* Logo */}
      <div className="w-full flex justify-center mb-20 z-10">
        <Image
          alt="Logo"
          width={120}
          height={40}
          className="dark:invert h-7 w-auto"
          src="/rechat-logo-dark.svg"
          priority
        />
      </div>

      {/* Main content */}
      <div className="z-10 w-full max-w-5xl px-4 mx-auto">
        <div className="text-center justify-center">
          <h1 className="text-[24px] font-semibold text-center text-gray-900 dark:text-gray-100">
            Choose your plan
          </h1>
          <p className="mx-auto text-[16px] text-gray-700 mb-8 dark:text-gray-300">
            Find a plan that fits your needs
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className="flex flex-col bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 min-h-[450px]"
            >
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {plan.name}
                </CardTitle>
                <p className="text-gray-600 text-sm dark:text-gray-400">
                  {plan.description}
                </p>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="text-4xl font-bold mt-4 mb-6 text-gray-900 dark:text-gray-100">
                  ${plan.price}
                  <span className="text-base text-sm font-normal text-gray-600 dark:text-gray-400 ml-2">
                    {plan.price > 0 ? "per user / month" : ""}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  {plan.billing}
                </p>
                <p className="text-sm text-semibold text-gray-900 dark:text-gray-100 mb-4">
                  {getFeatureHeader(plan.name)}
                </p>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2 mt-auto">
                {plan.href ? (
                  <Link href={plan.href} className="w-full">
                    <Button className={getButtonStyles(plan)}>
                      {plan.cta}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    onClick={() => trigger()}
                    className={getButtonStyles(plan)}
                  >
                    {plan.cta}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        <Link
          href="/onboarding/connect"
          className="block text-sm text-gray-600 dark:text-gray-400 text-center mt-8 hover:underline cursor-pointer"
        >
          {"I'll do this later"}
        </Link>
      </div>
    </div>
  );
}