import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import { SheetTrigger, SheetContent, Sheet } from "../ui/sheet";
import Image from "next/image";
import Link from "next/link";

const navItems = [
  { href: "/", text: "IntegrationOS", isLogo: true },
  { href: "/chat", text: "Chat" },
  { href: "/apps", text: "Apps" },
];

export const Header = ({ active }: { active?: string }) => {
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 text-lg font-semibold md:text-base ${
              active === item.text.toLowerCase() ? "text-foreground" : "text-muted-foreground"
            } transition-colors hover:text-foreground`}
          >
            {item.isLogo && (
              <>
                <Image src="/images/icon.svg" alt={item.text} width="50" height="50" />
                <span className="sr-only">{item.text}</span>
              </>
            )}
            {!item.isLogo && item.text}
          </Link>
        ))}
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 text-lg font-semibold"
              >
                {item.isLogo && (
                  <>
                    <Image src="/images/icon.svg" alt={item.text} width="50" height="50" />
                    <span className="sr-only">{item.text}</span>
                  </>
                )}
                {!item.isLogo && item.text}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
};