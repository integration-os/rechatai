"use server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { api } from "../../../convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { DynamicApps } from "./dynamic-apps";
import NavbarComponent from "@/components/navbar";
import { TwoSidePanel } from "../../components/ui/two-side-panel";
import { ensureToken } from "../../lib/actions/helpers";
import { AI } from "../../lib/chat/actions";
import DotPattern from "../../components/magicui/dot-pattern";
import { cn } from "../../lib/utils";

export default async function DashboardPage() {
  const { userId } = auth();
  const user = await currentUser();
  const token = await ensureToken();

  if (!userId || !user) {
    redirect("/sign-in");
  }

  const apps = await fetchQuery(
    api.apps.getAppsByOwnerId,
    {},
    {
      token,
    }
  );

  return (
    <main className="flex flex-col w-full">
      <AI initialAIState={{ messages: [] }}>
        <NavbarComponent />
        <TwoSidePanel
          defaultLayout={[100, 0]}
          right={<></>}
          left={
            <div>
              <DotPattern
                width={12}
                height={12}
                className={cn(
                  "[mask-image:radial-gradient(300px_circle_at_center,rgba(255,255,255,0.7),rgba(255,255,255,0.5))]"
                )}
              />
              <DynamicApps />
            </div>
          }
        />
      </AI>
    </main>
  );
}
