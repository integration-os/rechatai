import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Card, CardContent } from "./card";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CornerDownLeftIcon,
  Plus,
  Sparkles,
  X,
} from "lucide-react";
import { Textarea } from "./textarea";
import { cn } from "@/lib/utils";
import { Markdown } from "./markdown";
import { AIVersion } from "./code-editor-with-ai";
import { Badge } from "./badge";
import { ColorfulLoadingAnimation } from "../colorful-loading-animation";
import { ScrollArea } from "./scroll-area";

const MAX_CONNECTIONS = 0;

export type AIModel =
  | "Claude 3.5 Sonnet"
  | "Rechat UI Assistant"
  | "Rechat Connection Assistant"
  | "Rechat Logic Assistant";

export type AIProcessor = (input: {
  code: string;
  message: string;
  model: AIModel;
}) => Promise<{ code: string; explanation: string }>;

interface AIAssistantPanelProps {
  aiMessage: string;
  setAiMessage: (msg: string) => void;
  isProcessing: boolean;
  handleAIChange: (msg: string) => void;
  selectedModel: AIModel;
  setSelectedModel: (model: AIModel) => void;
  versions: AIVersion[];
  currentVersionIndex: number;
  navigateVersion: (direction: "prev" | "next") => void;
  availableModels?: AIModel[];
  availableConnections?: string[];
  onConnectionSelect?: (connection: string) => void;
}

const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({
  aiMessage,
  setAiMessage,
  isProcessing,
  handleAIChange,
  selectedModel,
  setSelectedModel,
  versions,
  currentVersionIndex,
  navigateVersion,
  availableModels = ["Claude 3.5 Sonnet"],
  availableConnections = [
    "Shopify",
    "Attio",
    "BigCommerce",
    "Airtable",
    "Notion",
    "Google Sheets",
    "Hubspot",
    "Zendesk",
    "Salesforce",
    "Microsoft Dynamics",
    "NetSuite",
    "QuickBooks",
    "Zoho",
    "FreshBooks",
    "OpenAI",
    "Anthropic",
  ],
  onConnectionSelect,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedConnections, setSelectedConnections] = useState<string[]>([]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = isProcessing
        ? scrollRef.current.scrollHeight
        : 0;
    }
  }, [isProcessing]);

  const handleFormSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (aiMessage.trim()) handleAIChange(aiMessage);
    },
    [aiMessage, handleAIChange]
  );

  const handleConnectionSelect = useCallback(
    (connection: string) => {
      if (
        !selectedConnections.includes(connection) &&
        selectedConnections.length < MAX_CONNECTIONS
      ) {
        setSelectedConnections((prev) => [...prev, connection]);
        onConnectionSelect?.(connection);
      }
    },
    [selectedConnections, onConnectionSelect]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setAiMessage(newValue);

      // Check for connection names in the input
      const words = newValue.toLowerCase().split(/\s+/);
      const newConnections = availableConnections.filter(
        (conn) =>
          words.includes(conn.toLowerCase()) &&
          !selectedConnections.includes(conn)
      );

      if (newConnections.length > 0) {
        const updatedConnections = [
          ...selectedConnections,
          ...newConnections,
        ].slice(0, MAX_CONNECTIONS);
        setSelectedConnections(updatedConnections);
        newConnections.forEach((conn) => onConnectionSelect?.(conn));
      }
    },
    [
      availableConnections,
      selectedConnections,
      onConnectionSelect,
      setAiMessage,
    ]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (aiMessage.trim()) {
          handleAIChange(aiMessage);
        }
      }
    },
    [aiMessage, handleAIChange]
  );

  const randomLoadingAnimation = () => {
    const patterns = ["default", "pulsate",  "wave", "dance", "spine"] as const;
    const colorSchemes = ["default", "greenBlue", "blueShades"] as const;
    
    return {
      animationPattern: patterns[Math.floor(Math.random() * patterns.length)],
      colorScheme: colorSchemes[Math.floor(Math.random() * colorSchemes.length)],
    };
  };

  return (
    <Card>
      <CardContent className="p-2 pb-0 flex flex-col justify-between h-full">
        <div className="mb-2 flex flex-col gap-1">
          <h3 className="text-sm font-semibold">AI Assistant</h3>
          <p className="text-xs text-muted-foreground">
            Works best when you enter a single instruction at a time
          </p>
        </div>
        <div ref={scrollRef} className="flex-grow overflow-y-auto mb-auto">
          {versions.length > 0 && (
            <div className="p-2 mb-2 rounded bg-muted/50 flex flex-col gap-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-400">
                  Version {currentVersionIndex + 1} of {versions.length}
                </span>
                <div className="flex items-center">
                  <Button
                    onClick={() => navigateVersion("prev")}
                    disabled={currentVersionIndex === 0}
                    className="h-6 w-6 p-0 mr-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => navigateVersion("next")}
                    disabled={currentVersionIndex === versions.length - 1}
                    className="h-6 w-6 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-xs">{versions[currentVersionIndex].message}</p>

              {versions[currentVersionIndex]?.explanation && (
                <div className="mt-2 text-xs">
                  <span>
                    <Sparkles className="h-4 w-4 text-purple-300 inline my-2" />
                  </span>
                  <div className="h-[400px] w-full overflow-auto">
                    <Markdown
                      content={versions[currentVersionIndex]?.explanation}
                      fontSize="xs"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          {isProcessing && (
            <div className="p-2 mb-2 rounded bg-muted/50">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-400 animate-text-light-sweep">
                  Version {versions.length + 1} of {versions.length + 1}
                </span>
                <ColorfulLoadingAnimation scale={0.7}
                animationPattern={randomLoadingAnimation().animationPattern}
                colorScheme={randomLoadingAnimation().colorScheme}
                />
              </div>
              <p className="text-xs animate-text-light-sweep">Thinking...</p>
            </div>
          )}
        </div>
        <form
          onSubmit={handleFormSubmit}
          className="flex flex-col border-1 rounded-md p-1"
        >
          <div className="flex-grow relative rounded-md border p-1">
            <div className="flex items-center gap-1 p-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="default"
                    size="xs"
                    className="h-4 w-4 text-[9px] bg-muted hover:bg-muted/80 p-1 font-mono font-thin text-foreground/50 cursor-pointer"
                    disabled={selectedConnections.length >= MAX_CONNECTIONS}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  {availableConnections.map((connection) => (
                    <DropdownMenuItem
                      key={connection}
                      onClick={() => handleConnectionSelect(connection)}
                      className="text-[10px]"
                      disabled={selectedConnections.length >= MAX_CONNECTIONS}
                    >
                      {connection}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              {selectedConnections.map((connection) => (
                <Badge
                  key={connection}
                  variant="secondary"
                  className="text-[9px] px-1 py-0 h-4 font-light text-muted-foreground"
                >
                  {connection}
                  <Button
                    variant="ghost"
                    size="xs"
                    className="h-3 w-3 p-0 ml-1"
                    onClick={() =>
                      setSelectedConnections(
                        selectedConnections.filter((c) => c !== connection)
                      )
                    }
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              ))}
            </div>
            <Textarea
              tabIndex={0}
              placeholder="Ask AI..."
              className={cn(
                "min-h-[60px] w-full resize-none bg-transparent border-0 px-2 py-2 text-xs sm:text-xs focus:outline-none focus:ring-0 focus-visible:ring-0 focus:border-0 focus-visible:border-0 focus-visible:outline-none ring-0 ring-offset-0 focus-visible:ring-transparent active:ring-transparent active:ring-offset-transparent",
                isProcessing && "animate-text-light-sweep"
              )}
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              name="message"
              rows={1}
              value={aiMessage}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={isProcessing}
            />
            <div className="flex items-center justify-between mt-2 px-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-6 px-0 text-[9px] font-mono font-thin text-foreground/50 hover:bg-transparent"
                  >
                    {selectedModel} <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  {availableModels.map((model) => (
                    <DropdownMenuItem
                      key={model}
                      onClick={() => setSelectedModel(model)}
                      className="text-[10px]"
                    >
                      {model}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                type="submit"
                disabled={isProcessing || !aiMessage.trim()}
                className="h-7 px-3 text-xs flex items-center border-none"
                size="xs"
              >
                <CornerDownLeftIcon className="mr-1 h-3 w-3" />
                Send
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AIAssistantPanel;
