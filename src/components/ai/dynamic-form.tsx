"use client";

import { useState, useEffect } from "react";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";
import { useActions, useUIState, useAIState } from "ai/rsc";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AI, AIState } from "@/lib/chat/actions";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

interface FormField {
  type: "text" | "number" | "checkbox" | "select" | "textarea" | "switch" | "radio" | "date";
  name: string;
  label: string;
  options?: string[];
  value?: string | boolean | number | Date;
}

export interface DynamicFormProps {
  fields: FormField[];
  toolCallId: string;
  isSubmitted?: boolean;
  submittedData?: Record<string, string | boolean | number | Date>;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  toolCallId,
  isSubmitted: initialIsSubmitted = false,
  submittedData = {},
}) => {
  const [formData, setFormData] = useState<
    Record<string, string | boolean | number | Date>
  >(() => {
    const initialData: Record<string, string | boolean | number | Date> = {};
    fields.forEach((field) => {
      if (field.value !== undefined) {
        initialData[field.name] = field.value;
      }
    });
    return { ...initialData, ...submittedData };
  });
  const [isSubmitted, setIsSubmitted] = useState(initialIsSubmitted);
  const [, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions();
  const [aiState, setAIState] = useAIState<typeof AI>();

  const handleInputChange = (
    name: string,
    value: string | boolean | number | Date
  ) => {
    if (!isSubmitted) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    if (isSubmitted) return;

    setIsSubmitted(true);

    // Update AI state with form data, this does not translate to the server yet.
    // setAIState((prevState: AIState) => ({
    //   ...prevState,
    //   messages: [
    //     ...prevState.messages,
    //     {
    //       role: "tool",
    //       content: [
    //         {
    //           toolName: "dynamic-form",
    //           type: "tool-result",
    //           isError: false,
    //           result: formData,
    //           toolCallId,
    //         },
    //       ],
    //       id: Date.now().toString(),
    //       createdAt: Date.now(),
    //     },
    //   ],
    // }));

    // Submit user message with form data
    const responseMessage = await submitUserMessage(
      JSON.stringify({
        type: "form_submission",
        formData,
        fields: fields.map((field) => ({
          name: field.name,
          label: field.label,
          type: field.type,
        })),
      })
    );
    setMessages((currentMessages: any) => [
      ...currentMessages,
      responseMessage,
    ]);
  };

  return (
    <div className="flex flex-col text-sm gap-3 min-w-80">
      {fields.map((field) => (
        <div key={field.name} className="flex flex-col gap-2">
          <Label htmlFor={field.name} className="text-xs font-medium">
            {field.label}
          </Label>
          {field.type === "text" && (
            <Input
              id={field.name}
              name={field.name}
              value={(formData[field.name] as string) || ""}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className="h-7 text-xs"
              disabled={isSubmitted}
            />
          )}
          {field.type === "number" && (
            <Input
              id={field.name}
              name={field.name}
              type="number"
              value={(formData[field.name] as number) || ""}
              onChange={(e) => handleInputChange(field.name, parseFloat(e.target.value))}
              className="h-7 text-xs"
              disabled={isSubmitted}
            />
          )}
          {field.type === "checkbox" && (
            <Checkbox
              id={field.name}
              name={field.name}
              checked={(formData[field.name] as boolean) || false}
              onCheckedChange={(checked) =>
                handleInputChange(field.name, checked)
              }
              className="h-4 w-4"
              disabled={isSubmitted}
            />
          )}
          {field.type === "select" && (
            <Select
              value={(formData[field.name] as string) || ""}
              onValueChange={(value) => handleInputChange(field.name, value)}
              disabled={isSubmitted}
            >
              <SelectTrigger className="h-7 text-xs">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option} value={option} className="text-xs">
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {field.type === "textarea" && (
            <Textarea
              id={field.name}
              name={field.name}
              value={(formData[field.name] as string) || ""}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className="text-xs min-h-[60px]"
              disabled={isSubmitted}
            />
          )}
          {field.type === "switch" && (
            <Switch
              id={field.name}
              name={field.name}
              checked={(formData[field.name] as boolean) || false}
              onCheckedChange={(checked) =>
                handleInputChange(field.name, checked)
              }
              disabled={isSubmitted}
            />
          )}
          {field.type === "radio" && (
            <RadioGroup
              value={(formData[field.name] as string) || ""}
              onValueChange={(value) => handleInputChange(field.name, value)}
              className="flex flex-col space-y-1"
              disabled={isSubmitted}
            >
              {field.options?.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option}
                    id={`${field.name}-${option}`}
                    className="h-3 w-3"
                    disabled={isSubmitted}
                  />
                  <Label
                    htmlFor={`${field.name}-${option}`}
                    className="text-xs"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
          {field.type === "date" && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal h-7 text-xs",
                    !formData[field.name] && "text-muted-foreground"
                  )}
                  disabled={isSubmitted}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData[field.name] ? (
                    format(formData[field.name] as Date, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData[field.name] as Date ?? new Date()}
                  onSelect={(date) => handleInputChange(field.name, date ?? new Date())}
                  initialFocus
                  disabled={isSubmitted}
                />
              </PopoverContent>
            </Popover>
          )}
        </div>
      ))}
      {(
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            onClick={handleSubmit}
            className="h-7 text-xs w-full"
            disabled={isSubmitted}
          >
            {isSubmitted ? "Submitted" : "Submit"}
          </Button>
        </motion.div>
      )}
    </div>
  );
};
