import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header container */}
      <header className="w-full border-b">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
            <Image
                alt="Logo"
                width={100}
                height={30}
                className="dark:invert h-6 w-auto"
                src="/rechat-logo-dark.svg"
                priority
              />
            </Link>
            
            {/* Navigation buttons */}
            <div className="flex gap-3 w-full sm:w-auto justify-center sm:justify-end">
              <Button 
                variant="default" 
                asChild 
                className="w-full sm:w-auto"
              >
                <Link href="/sign-in">Log in</Link>
              </Button>
              <Button 
                variant="outline" 
                asChild 
                className="w-full sm:w-auto"
              >
                <Link href="/sign-up">Sign up</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow flex justify-center items-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          <SignIn />
        </div>
      </main>
    </div>
  );
}