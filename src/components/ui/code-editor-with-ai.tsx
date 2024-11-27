import React, { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { typescriptLanguage } from "@codemirror/lang-javascript";
import { materialDark } from "@uiw/codemirror-theme-material";
import { Button } from "./button";
import { Card, CardContent } from "./card";
import { Sparkles, Save, XCircle, Code, Eye } from "lucide-react";
import { basicSetup } from "codemirror";
import AIAssistantPanel, { AIProcessor, AIModel } from "./ai-assistant-panel";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";
import { CodeRenderer } from "../../lib/dynamic-ui/dynamic-component";
import { EditorView } from "@codemirror/view";
import { DashboardIcon } from "@radix-ui/react-icons";
import { usePathname } from "next/navigation";
import useTracking from "@/hooks/useTracking";
import { trackingConsts } from "@/lib/tracking";

interface CodeEditorWithAIProps {
  code: string;
  onChange: (version: AIVersion) => void; // Updated to accept AIVersion
  aiProcessor: AIProcessor;
  language?: any;
  theme?: any;
  handleRemoveFromDashboard?: () => void;
  handleAddToDashboard?: () => void;
  isVisible?: boolean;
  initialModel?: AIModel;
  initialVersions?: AIVersion[];
  availableConnections?: string[]; // New prop
  appId?: string;
}

export interface AIVersion {
  message: string;
  code: string;
  explanation?: string;
}

export const CodeEditorWithAI: React.FC<CodeEditorWithAIProps> = ({
  code,
  onChange,
  aiProcessor,
  language = typescriptLanguage,
  theme = materialDark,
  initialModel = "Claude 3.5 Sonnet",
  initialVersions,
  handleRemoveFromDashboard,
  handleAddToDashboard,
  isVisible,
  appId,
  availableConnections = [
    "Shopify",
    "Attio",
    "BigCommerce",
    "Airtable",
    "Notion",
    "Google Sheets",
  ],
}) => {
  const [aiMessage, setAiMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModel>(initialModel);
  const [versions, setVersions] = useState<AIVersion[]>(
    initialVersions || [{ message: "Initial version", code }]
  );
  const [currentVersionIndex, setCurrentVersionIndex] = useState(
    initialVersions ? initialVersions.length - 1 : 0
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [tempCode, setTempCode] = useState(code);
  const [selectedConnections, setSelectedConnections] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"code" | "preview">("preview");
  const path = usePathname();
  const { track } = useTracking();

  useEffect(() => {
    setTempCode(code);
  }, [code]);

  useEffect(() => {
    setVersions(initialVersions || [{ message: "Initial version", code }]);
    setCurrentVersionIndex(initialVersions ? initialVersions.length - 1 : 0);
  }, [initialVersions, code]);

  const handleAIChange = async (message: string) => {
    if (!message.trim() || isProcessing) return;
    setIsProcessing(true);

    const result = await aiProcessor({ code: tempCode, message, model: selectedModel });

    // Update this part to handle the new result format
    const newCode = typeof result === "string" ? result : result.code;
    const explanation =
      typeof result === "string" ? undefined : result.explanation;

    // Add new version, overwriting any versions after the current one
    const newVersion: AIVersion = { message, code: newCode, explanation };
    const updatedVersions = versions.slice(0, currentVersionIndex + 1);
    updatedVersions.push(newVersion);
    setVersions(updatedVersions);
    setCurrentVersionIndex(updatedVersions.length - 1);

    // Update tempCode to reflect the new changes
    setTempCode(newCode);

    onChange(newVersion); // Updated to pass the entire AIVersion object
    setAiMessage("");
    setIsProcessing(false);
    setHasUnsavedChanges(false); // Reset unsaved changes flag
    track(trackingConsts.CHAT.SENT_MESSAGE, { message, appId })
  };

  const navigateVersion = (direction: "prev" | "next") => {
    const newIndex =
      direction === "prev" ? currentVersionIndex - 1 : currentVersionIndex + 1;
    if (newIndex >= 0 && newIndex < versions.length) {
      setCurrentVersionIndex(newIndex);
      setTempCode(versions[newIndex].code);
      setHasUnsavedChanges(false);
      // onChange(versions[newIndex]); // Updated to pass the entire AIVersion object
    }
  };

  const handleSaveChanges = () => {
    const newVersion: AIVersion = {
      message: "Manual edit",
      code: tempCode,
    };
    const updatedVersions = versions.slice(0, currentVersionIndex + 1);
    updatedVersions.push(newVersion);
    setVersions(updatedVersions);
    setCurrentVersionIndex(updatedVersions.length - 1);
    onChange(newVersion); // Updated to pass the entire AIVersion object
    setHasUnsavedChanges(false);
    track(trackingConsts.APP_TEMPLATES.SAVED_CODE, { appId, message: newVersion?.message });
  };

  const handleCancelChanges = () => {
    setTempCode(versions[currentVersionIndex].code);
    setHasUnsavedChanges(false);
  };

  const handleConnectionSelect = (connection: string) => {
    if (!selectedConnections.includes(connection)) {
      setSelectedConnections((prev) => [...prev, connection]);
    }
  };

  return (
    <Card className="w-full bg-background shadow-2xl">
      <CardContent className="p-4">
        <div className="flex flex-col">
          <div className="relative w-full flex flex-row gap-4">
            <div className={`flex flex-row overflow-auto justify-between mb-2 ${showAIPanel ? "w-[70%]" : "w-full"}`}>
              <Tabs
                value={activeTab}
                onValueChange={(value) =>
                  setActiveTab(value as "code" | "preview")
                }
                className="w-full"
              >
                <div className="flex mb-2 w-full justify-between">
                  <TabsList className="h-8">
                    <TabsTrigger value="preview" className="px-2 py-1 text-xs">
                      <Eye className="w-3 h-3 mr-1" />
                      Preview
                    </TabsTrigger>
                    <TabsTrigger value="code" className="px-2 py-1 text-xs">
                      <Code className="w-3 h-3 mr-1" />
                      Code
                    </TabsTrigger>
                  </TabsList>
                  <div className="flex justify-end gap-2">
                    {path.includes("/dashboard") && (
                      <Button
                        onClick={handleRemoveFromDashboard}
                        variant="outline"
                        size="xs"
                      >
                        <DashboardIcon className="w-4 h-4 mr-2" />
                        Remove from dashboard
                      </Button>
                    )}
                    {path.includes("/chat") && (
                      <Button
                        disabled={isVisible}
                        onClick={handleAddToDashboard}
                        variant="outline"
                        size="xs"
                      >
                        <DashboardIcon className="w-4 h-4 mr-2" />
                        Add to dashboard
                      </Button>
                    )}
                    <Button
                      onClick={() => setShowAIPanel((prev) => !prev)}
                      variant="outline"
                      size="xs"
                      className="text-xs"
                    >
                      {showAIPanel ? "Close assistant" : "Edit with AI"}
                      <Sparkles className="w-3 h-3 text-purple-300 ml-1" />
                    </Button>
                  </div>
                </div>
                <TabsContent value="code" className="relative">
                  <CodeMirror
                    value={tempCode}
                    height="400px"
                    extensions={[basicSetup, language, EditorView.lineWrapping]}
                    theme={theme}
                    onChange={(value) => {
                      setTempCode(value);
                      setHasUnsavedChanges(true);
                    }}
                    className="w-full overflow-x-auto"
                    basicSetup={{
                      allowMultipleSelections: true,
                      autocompletion: true,
                    }}
                  />
                  {hasUnsavedChanges && (
                    <div className="absolute bottom-4 right-4 z-10 flex gap-1">
                      <Button
                        onClick={handleCancelChanges}
                        variant="outline"
                        size="xs"
                      >
                        <XCircle className="w-3 h-3 text-red-500 mr-1" />
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSaveChanges}
                        variant="outline"
                        size="xs"
                      >
                        <Save className="w-3 h-3 text-green-500 mr-1" />
                        Save
                      </Button>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="preview" className="">
                  <div className="max-h-[calc(100vh-100px)] overflow-auto w-full">
                    <CodeRenderer code={tempCode} />
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {showAIPanel && (
             <div className="overflow-auto w-[30%] max-w-[38rem]">
               <AIAssistantPanel
                aiMessage={aiMessage}
                setAiMessage={setAiMessage}
                isProcessing={isProcessing}
                handleAIChange={handleAIChange}
                selectedModel={selectedModel}
                setSelectedModel={setSelectedModel}
                versions={versions}
                currentVersionIndex={currentVersionIndex}
                navigateVersion={navigateVersion}
                onConnectionSelect={handleConnectionSelect}
                availableConnections={availableConnections}
              />
             </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
