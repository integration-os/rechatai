import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";
import { FullStory } from '@fullstory/browser';


export const useCreateUserUx = () => {
  const { user } = useUser();

  const createUser = useMutation(api.users.storeUser);

  const [isLoading, setIsLoading] = useState(false);

  const trigger = async () => {
    try {
      setIsLoading(true);
      const name =
        user?.fullName ||
        user?.username ||
        user?.emailAddresses?.[0]?.emailAddress ||
        "";
      const email = user?.emailAddresses?.[0]?.emailAddress || "";

      if (user) {
        await createUser({
          id: user.id,
          email,
          name,
        });

        FullStory('setIdentity', {
          uid: user.id,
          properties: {
            displayName: name,
            email: email,
          }
        });

      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      if (axios.isAxiosError(error)) {
        toast.error("Something went wrong", {
          description: "An error occurred while creating user",
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
