/* eslint-disable @next/next/no-assign-module-variable */
"use client";
import React, { useState, useEffect, Suspense, ErrorInfo, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import * as LucideIcons from "lucide-react";
import CodeMirror from '@uiw/react-codemirror';
import { typescriptLanguage } from '@codemirror/lang-javascript';
import { githubDark } from '@uiw/codemirror-theme-github';

import ComponentsContext from "./context";
import { Eye, Code, Save, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardIcon } from "@radix-ui/react-icons";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { toast } from "sonner";
import Loading from "../../components/ui/loading";
import { ToggleGroup, ToggleGroupItem } from "../../components/ui/toggle-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeEditorWithAI } from "../../components/ui/code-editor-with-ai";
import { ControlledCodeEditorWithAI } from "../../controlled-components/controlled-code-editor-with-ai";

interface DynamicComponentProps {
  id?: string;
  code: string;
  title: string;
  description?: string;
  prompt: string;
  addOrRemove: "add" | "remove";
  platformsUsed?: {
    platform: string;
    connectionKey: string;
    models: string[];
  }[];
  hideControls?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorMessage error={this.state.error?.message || "Unknown Error"} />
      );
    }

    return this.props.children;
  }
}

const ErrorMessage = ({ error }: { error: string }) => {
  const handleCopyError = () => {
    const errorMessage = `I have encountered the following error in the app:\n\`\`\`markdown\n${error}\n\`\`\` \n\nPlease fix the error and send it back to me.`;
    navigator.clipboard.writeText(errorMessage).then(() => {
      toast.success("Error message copied to clipboard");
    }).catch((err) => {
      console.error("Failed to copy error message:", err);
      toast.error("Failed to copy error message");
    });
  }

  return (
    <div className="flex flex-col p-4 gap-2 rounded-sm border border-dashed items-center m-4">
      <h1 className="font-mono font-bold">Runtime Error :(</h1>
      <p className="font-mono text-xs">{error}</p>
      <Button variant="outline" size="xs" onClick={handleCopyError}>
        <LucideIcons.Copy className="w-4 h-4 mr-2" />
        Copy Error
      </Button>
    </div>
  );
};

interface CodeRendererProps {
  code: string;
  onError?: (error: string) => void;
}

declare global {
  interface Window {
    esbuild: any;
  }
}

let esbuildInitializePromise: Promise<void> | null = null;

const loadEsbuild = async () => {
  if (!esbuildInitializePromise) {
    esbuildInitializePromise = (async () => {
      if (typeof window.esbuild === "undefined") {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src =
            "https://unpkg.com/esbuild-wasm@0.14.54/lib/browser.min.js";
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load esbuild"));
          document.head.appendChild(script);
        });
      }

      if (!window.esbuild.initialized) {
        await window.esbuild.initialize({
          wasmURL: "https://unpkg.com/esbuild-wasm@0.14.54/esbuild.wasm",
        });
        window.esbuild.initialized = true;
      }
    })();
  }

  return esbuildInitializePromise;
};

export const CodeRenderer: React.FC<CodeRendererProps> = ({ code, onError }) => {
  const [error, setError] = useState<string | null>(null);
  const [Component, setComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    const loadComponentAsync = async () => {
      try {
        await loadEsbuild();
        const result = await window.esbuild.transform(code, {
          loader: "tsx",
          jsxFactory: "React.createElement",
          jsxFragment: "React.Fragment",
          format: "cjs",
        });

        const transformedCode = result.code;
        const module = { exports: {} };
        const require = createRequireFunction();

        new Function("module", "exports", "require", transformedCode)(
          module,
          module.exports,
          require
        );

        // @ts-ignore
        let exportedComponent = module.exports.default || module.exports;

        if (typeof exportedComponent === "object" && exportedComponent !== null) {
          exportedComponent = Object.values(exportedComponent)[0];
        }

        if (typeof exportedComponent === "function") {
          setComponent(() => exportedComponent as React.ComponentType);
          setError(null);
        } else {
          throw new Error("Failed to load component: No valid export found");
        }
      } catch (error: any) {
        console.error("Error loading component:", error);
        const errorMessage = error.message;
        setError(errorMessage);
        setComponent(null);
        if (onError) {
          onError(errorMessage);
        }
      }
    };

    loadComponentAsync();
  }, [code, onError]);

  return (
    <ErrorBoundary key={code}>
      <Suspense fallback={<Loading />}>
        <div className="bg-background">
          {error ? (
            <ErrorMessage error={error} />
          ) : (
            Component && <Component />
          )}
        </div>
      </Suspense>
    </ErrorBoundary>
  );
};

export const DynamicComponent: React.FC<DynamicComponentProps> = ({
  id,
  code: initialCode,
  title,
  description,
  platformsUsed,
  prompt,
  addOrRemove = "add",
  hideControls = false,
}) => {
  const [view, setView] = useState<'component' | 'code'>('component');
  const [code, setCode] = useState(initialCode);
  const [editedCode, setEditedCode] = useState(initialCode);
  const [isCodeChanged, setIsCodeChanged] = useState(false);

  const addApp = useMutation(api.apps.createApp);
  const removeApp = useMutation(api.apps.removeApp);

  const handleCodeChange = useCallback((value: string) => {
    setEditedCode(value);
    setIsCodeChanged(value !== code);
  }, [code]);

  const handleSaveCode = useCallback(() => {
    setCode(editedCode);
    setIsCodeChanged(false);
    toast.success("Code saved successfully", {
      duration: 3000,
      icon: <CheckCircle2 className="w-4 h-4" />,
    });
  }, [editedCode]);

  if (hideControls) {
    return <CodeRenderer code={code} />;
  }

  return (
    <div className={getContainerClassName()}>

        <ControlledCodeEditorWithAI
          code={code}
        />

    </div>
  );

  function getContainerClassName() {
    return window.location.pathname !== "/dashboard" ? "md:max-w-3xl lg:max-w-3xl xl:max-w-4xl" : "";
  }

  function renderCardHeader() {
    return (
      <div className="flex flex-row justify-between items-center py-2">
        {/* <div className="flex flex-col justify-start gap-1">
          <h2 className="text-lg font-bold">{title}</h2>
          <p className="text-sm text-gray-500">{description}</p>
        </div> */}
          {renderViewToggle()}
          {renderDashboardButton()}
      
      </div>
    );
  }

  function renderViewToggle() {
    return (
      <Tabs value={view} onValueChange={(value) => setView(value as 'component' | 'code')}>
        <TabsList className="h-8">
          <TabsTrigger value="component" className="text-xs px-2 py-1">
            <Eye className="w-3 h-3 mr-1" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="code" className="text-xs px-2 py-1">
            <Code className="w-3 h-3 mr-1" />
            Code
          </TabsTrigger>
        </TabsList>
      </Tabs>
    );
  }

  function renderSaveButton() {
    return (
      <div className="absolute top-2 right-2 z-10">
        <Button
          onClick={handleSaveCode}
          variant="outline"
          size="xs"
          disabled={!isCodeChanged}
        >
          <Save className="w-4 h-4 mr-2" />
          Save changes
        </Button>
      </div>
    );
  }

  function renderDashboardButton() {
    return addOrRemove === "add" ? (
      <Button
        onClick={handleAddComponent}
        variant="outline"
        size="xs"
      >
        <DashboardIcon className="w-4 h-4 mr-2" />
        Add to dashboard
      </Button>
    ) : (
      <Button
        onClick={handleRemoveComponent}
        variant="outline"
        size="xs"
      >
        <DashboardIcon className="w-4 h-4 mr-2" />
        Remove from dashboard
      </Button>
    );
  }

  function renderCodeEditor() {
    return (
      <ControlledCodeEditorWithAI
        code={editedCode}
        // height="calc(100vh - 200px)"
        // extensions={[typescriptLanguage]}
        // editable={true}
      />
    );
  }

  function handleAddComponent() {
    addApp({
      code,
      title,
      description,
      platformsUsed: platformsUsed || [],
      name: title.toLowerCase().replace(/\s/g, "-"),
      prompt,
      isVisible: true,
    });
    toast("Component added", {
      duration: 5000,
      description: "The app has been successfully added to your dashboard.",
      icon: <CheckCircle2 className="h-4 w-4" />,
    });
  }

  function handleRemoveComponent() {
    removeApp({
      id: id as Id<"apps">,
    });
    toast("Component removed", {
      duration: 5000,
      description: "The app has been successfully removed from your dashboard.",
      icon: <Trash2 className="h-4 w-4" />,
      closeButton: true,
    });
  }
};

function createRequireFunction() {
  return (moduleName: string) => {
    if (moduleName === "react") return React;
    if (moduleName === "@/components/ui/loading") return ComponentsContext.Loading;
    if (moduleName === "@/components/ui/advanced-table") return ComponentsContext.AdvancedTable;
    if (moduleName.startsWith("@/components/ui")) return { ...ComponentsContext };
    if (moduleName === "sonner") return { toast: ComponentsContext.toast };
    if (moduleName === "@nextui-org/react") return ComponentsContext.NextUI;
    if (moduleName === "@radix-ui/react-icons") return ComponentsContext.RadixUItIcons;
    if (moduleName === "@iconify/react") return ComponentsContext.Iconify;
    if (moduleName === "@tanstack/react-table") return ComponentsContext.TanStackTable;
    if (moduleName === "@tanstack/react-query") return {
      useQuery: ComponentsContext.useQuery,
      useMutation: ComponentsContext.useMutation,
      useInfiniteQuery: ComponentsContext.useInfiniteQuery,
      useQueryClient: ComponentsContext.useQueryClient,
    };
    if (moduleName === "recharts") return ComponentsContext.recharts;
    if (moduleName === "@dnd-kit/core") return ComponentsContext.DndKitCore;
    if (moduleName === "lucide-react") return LucideIcons;
    if (moduleName === "@/lib/frontend-api-helpers/unified") return {
      listUnifiedData: ComponentsContext.listUnifiedData,
      createUnifiedData: ComponentsContext.createUnifiedData,
      updateUnifiedData: ComponentsContext.updateUnifiedData,
      deleteUnifiedData: ComponentsContext.deleteUnifiedData,
    };
    if (moduleName === "lodash") return ComponentsContext.lodash;

    throw new Error(`Module ${moduleName} not found`);
  };
}

function createErrorComponent(errorMessage: string) {
  const ErrorComponent = () => (
    <div className="flex flex-col p-4 gap-2 rounded-sm border border-dashed items-center">
      <h1 className="text-lg font-mono font-bold">Failed to render UI :(</h1>
      <p className="font-mono text-sm">{errorMessage}</p>
    </div>
  );
  ErrorComponent.displayName = "ErrorComponent";
  return ErrorComponent;
}

export default DynamicComponent;
