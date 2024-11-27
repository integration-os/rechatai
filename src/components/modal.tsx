import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Separator } from "./ui/separator";

export const ModalComponent = ({
  title,
  description,
  actionTitle,
  onClick,
  isLoading,
  loadingTitle,
  variant = "destructive",
}: {
  title: string;
  description: string;
  actionTitle: string;
  onClick: () => void;
  isLoading: boolean;
  loadingTitle: string;
  variant?: "destructive" | "default" | "secondary" | "ghost" | "outline" | "link"; 
}) => {
  return (
    <DialogContent>
      <DialogHeader className="pt-4 px-4">
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <Separator />
      <DialogDescription className="px-4">{description}</DialogDescription>
      <Separator />
      <div className="px-4 pb-4 justify-between w-full flex flex-row">
        <DialogClose>
          <Button>Cancel</Button>
        </DialogClose>
        {!isLoading && (
          <Button variant={variant} onClick={onClick}>
            {actionTitle}
          </Button>
        )}
        {isLoading && (
          <Button variant={variant} disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {loadingTitle}
          </Button>
        )}
      </div>
    </DialogContent>
  );
};
