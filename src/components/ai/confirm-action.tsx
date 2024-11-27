"use client";

import { useState } from "react";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { useActions, useAIState, useUIState } from "ai/rsc";
import { AI } from "../../lib/chat/actions";

export interface ConfirmationPromptProps {
  promptText?: string;
  confirmText?: string;
  cancelText?: string;
  hideButtons?: boolean;
  selected?: "confirm" | "cancel" | null;
  hidePromptText?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const ConfirmationPrompt: React.FC<ConfirmationPromptProps> = ({
  promptText = "Are you sure?",
  confirmText = "Yes",
  cancelText = "No",
  hideButtons = false,
  selected = null,
  hidePromptText = false,
}) => {
  const [_selected, setSelected] = useState<"confirm" | "cancel" | null>(
    selected
  );

  const [, setMessages] = useUIState<typeof AI>();
  const [aiState] = useAIState<typeof AI>();
  const { submitUserMessage } = useActions();


  const handleConfirm = async () => {
    setSelected("confirm");

    const responseMessage = await submitUserMessage(`UIResponseConfirm: ${confirmText},OriginalPrompt: ${promptText}`);

    setMessages((currentMessages) => [...currentMessages, responseMessage]);

  };

  const handleCancel = async () => {
    setSelected("cancel");

    const responseMessage = await submitUserMessage(`UIResponseCancel: ${cancelText},OriginalPrompt: ${promptText}`);
    setMessages((currentMessages: any) => [
      ...currentMessages,
      responseMessage,
    ]);

  };

  return (
    <div className="flex flex-col text-sm gap-3">
      {!hidePromptText && <span>{promptText}</span>}
      {!hideButtons && (
        <div className="flex space-x-2 text-sm">
          <motion.button
            className={cn(
              "px-2 py-0.5 rounded text-xs transition-colors",
              "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
              "disabled:pointer-events-none disabled:opacity-50",
              "flex items-center space-x-1",
              hidePromptText && "-translate-y-3"
            )}
            onClick={handleConfirm}
            whileTap={{ scale: 0.95 }}
            disabled={!!_selected}
          >
            {_selected === "confirm" && <Check size={12} className="text-green-500" />}
            <span>{_selected === "confirm" ? "Confirmed" : confirmText}</span>
          </motion.button>
          <motion.button
            className={cn(
              "px-2 py-0.5 rounded text-xs transition-colors",
              "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
              "disabled:pointer-events-none disabled:opacity-50",
              "flex items-center space-x-1",
              hidePromptText && "-translate-y-3"
            )}
            onClick={handleCancel}
            whileTap={{ scale: 0.95 }}
            disabled={!!_selected}
          >
            {_selected === "cancel" && <X size={12} className="text-red-500" />}
            <span>{_selected === "cancel" ? "Cancelled" : cancelText}</span>
          </motion.button>
        </div>
      )}
    </div>
  );
};
