import { useMutation } from "convex/react";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";

export const useDeleteSessionUx = () => {
  const [isLoading, setIsLoading] = useState(false);

  const removeSession = useMutation(api.sessions.removeSession);

  const router = useRouter();

  const trigger = async ({
    session,
    setIsOpen,
  }: {
    session: string;
    setIsOpen: (v: boolean) => void;
  }) => {
    try {
      setIsLoading(true);
      await removeSession({
        id: session as Id<"sessions">,
      });
      
      if (window.location.pathname.includes(session)) {
        router.push("/chat");
        router.refresh();
      }


      setIsLoading(false);
      setIsOpen(false);

      toast("Chat session deleted", {
        description: "The chat session has been successfully deleted",
        action: {
          label: "Close",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
    } catch (error) {
      setIsLoading(false);
      if (axios.isAxiosError(error)) {
        toast.error("Something went wrong", {
          description: "An error occurred while deleting the chat session",
          action: {
            label: "Close",
            onClick: () => {
              toast.dismiss();
            },
          },
        });
      }
    }
  };

  return {
    trigger,
    isLoading,
  };
};