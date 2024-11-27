"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Chat } from "@/components/chat/Chat";
import NavbarComponent from "@/components/navbar";
import { TwoSidePanel } from "../../components/ui/two-side-panel";
import ControlledSideApps from "../../controlled-components/dashboard/controlled-side-apps";

export default async function ChatPage() {
  const { userId } = auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect("/sign-in");
  }

  return (
    <main className="flex flex-col w-full">
      <NavbarComponent />

      <TwoSidePanel
        left={<Chat/>}
        right={<ControlledSideApps />}
      />
    </main>
  );
}
