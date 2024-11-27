"use client";
import { Doc, Id } from "../../../convex/_generated/dataModel";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { ChevronRight, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AppListItem } from "./app-list-item";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { EmptyState } from "../ui/empty-state";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { useState } from "react";

const onAppClick = (app: Doc<"apps">) => {
  const element = document.getElementById(`app-${app._id}`);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "center" });
  }
};

export const SidePanel = ({
  apps,
  onDeleteClick,
  onAddClick,
}: {
  apps: Doc<"apps">[];
  onDeleteClick: (id: Id<"apps">) => void;
  onAddClick: () => void;
}) => {
  const [appToDelete, setAppToDelete] = useState<Doc<"apps"> | null>(null);

  const handleDeleteClick = (app: Doc<"apps">) => {
    setAppToDelete(app);
  };

  return (
    <div className="border-none shadow-none">
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className="text-md font-semibold">Saved apps</h1>
        <Button onClick={onAddClick} variant="outline" size="xs" asChild>
          <Link href="/chat">
            <Plus className="w-3 h-3 mr-1" />
            New app
          </Link>
        </Button>
      </div>
      <Separator />
      <ScrollArea className="flex-grow h-[calc(100vh-320px)] p-4">
        <ul className="space-y-2">
          {apps.map((app) => (
            <AppListItem
              key={app._id}
              app={app}
              onAppClick={onAppClick}
              onDeleteClick={handleDeleteClick}
            />
          ))}
        </ul>
      </ScrollArea>
      <AlertDialog
        open={!!appToDelete}
        onOpenChange={() => setAppToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the app
              &ldquo;{appToDelete?.title || "Untitled App"}&rdquo;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDeleteClick(appToDelete?._id as Id<"apps">)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
