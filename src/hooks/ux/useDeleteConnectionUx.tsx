import axios from "axios";
import { toast } from "sonner";
import useGlobal from "../useGlobal";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useState } from "react";

export const useDeleteConnectionUx = (setIsOpen: (isOpen: boolean) => void) => {
  const [connectionId, , { resetKey }] = useGlobal<string>([
    "connection",
    "selected",
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const removeConnection = useMutation(api.connections.deleteConnection);

  const trigger = async () => {
    try {
      setIsLoading(true);
      await removeConnection({
        _id: connectionId as Id<"connections">
      });
      setIsLoading(false);
      setIsOpen(false);
      resetKey();
      toast("Connection deleted", {
        description: "The connection has been successfully deleted",
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
          description: "An error occurred while deleting the connection",
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
