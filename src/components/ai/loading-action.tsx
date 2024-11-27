"use client";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { LoaderPinwheelIcon, CheckCircleIcon, CircleX } from "lucide-react";
import { ColorfulLoadingAnimation } from "../colorful-loading-animation";

export interface LoadingProps {
  message?: string;
  loaded?: boolean;
  loadedMessage?: string;
  state?: "loading" | "loaded-success" | "loaded-error";
}

export const LoadingPrompt: React.FC<LoadingProps> = ({
  message = "Thinking...",
  loaded = false,
  loadedMessage = "Data loaded successfully!",
  state = "loading",
}) => {
  return (
    <div className="flex items-center">
      <motion.div
        className={cn(
          "rounded text-sm transition-colors",
          "flex items-center "
        )}
        animate={{ opacity: loaded ? 1 : [0.5, 1, 0.5] }}
        transition={{
          duration: 1.5,
          repeat: loaded ? 0 : Infinity,
          ease: "easeInOut",
        }}
      >
        {!loaded ? (
          <div className="flex items-center gap-2">
            <ColorfulLoadingAnimation scale={1} />
            <span>{message}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {state === "loaded-error" ? (
              <CircleX size={16} className="text-red-500" />
            ) : (
              <CheckCircleIcon size={16} className="text-green-500" />
            )}
            <span>{loadedMessage}</span>
          </div>
        )}
      </motion.div>
    </div>
  );
};
