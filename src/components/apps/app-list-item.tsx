import { useCallback, useEffect, useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useTheme } from "next-themes";
import { useLocalStorage } from "../../lib/hooks/use-local-storage";
import { Doc } from "../../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CSSProperties } from "react";

import DynamicComponent from "../../lib/dynamic-ui/dynamic-component";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { EmptyState } from "../../components/ui/empty-state";
import { Button } from "../../components/ui/button";
import {
  AppWindow,
  ChevronRight,
  ChevronLeft,
  MessageSquare,
  LayoutGrid,
  ToggleLeft,
  Search,
  X,
  Trash,
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { getIntegrationLogoUrl } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TruncateText } from "../../components/ui/MiddleTruncate";

export const AppListItem = ({
    app,
    onAppClick,
    onDeleteClick,
  }: {
    app: Doc<"apps">;
    onAppClick: (app: Doc<"apps">) => void;
    onDeleteClick: (app: Doc<"apps">) => void;
  }) => (
    <li className="cursor-pointer bg-foreground-50 hover:bg-muted hover:text-primary transition-colors text-sm p-1 py-0 rounded-md flex items-center">
      <div 
        className="flex items-center gap-2 flex-grow min-w-0 mr-2" 
        onClick={() => onAppClick(app)}
      >
        <div className="flex-shrink-0 w-6 h-6 relative flex items-center justify-center">
          {app.platformsUsed && app.platformsUsed.length > 0 ? (
            app.platformsUsed
              .slice(0, 2)
              .map((integration, index) => (
                <Image
                  key={integration.platform}
                  src={getIntegrationLogoUrl(integration.platform)}
                  alt={integration.platform}
                  className={`w-4 h-4 absolute ${
                    app.platformsUsed && app.platformsUsed.length === 1
                      ? "inset-0 m-auto"
                      : index === 0
                        ? "top-0 left-0"
                        : "bottom-0 right-0"
                  }`}
                  width={16}
                  height={16}
                />
              ))
          ) : (
            <AppWindow className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
        <TruncateText text={app.title ?? "Untitled App"} maxLength={20} truncatePosition="middle" />
      </div>
      <Button
        variant="ghost"
        size="xs"
        className="flex-shrink-0"
        onClick={(e) => {
          e.stopPropagation();
          onDeleteClick(app);
        }}
      >
        <Trash className="h-3 w-3" />
      </Button>
    </li>
  );