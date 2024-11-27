// Inspired by Chatbot-UI and modified to fit the needs of this project
// @see https://github.com/mckaywrigley/chatbot-ui/blob/main/components/Markdown/CodeBlock.tsx

"use client";

import { FC, memo } from "react";
//@ts-ignore
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
//@ts-ignore
import { materialDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard";
import { IconCheck, IconCopy, IconDownload } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "./card";

interface Props {
  language: string;
  value: string;
  fontSize?: "xs" | "sm" | "md" | "lg";
}

interface languageMap {
  [key: string]: string | undefined;
}

export const programmingLanguages: languageMap = {
  javascript: ".js",
  python: ".py",
  java: ".java",
  c: ".c",
  cpp: ".cpp",
  "c++": ".cpp",
  "c#": ".cs",
  ruby: ".rb",
  php: ".php",
  swift: ".swift",
  "objective-c": ".m",
  kotlin: ".kt",
  typescript: ".ts",
  go: ".go",
  perl: ".pl",
  rust: ".rs",
  scala: ".scala",
  haskell: ".hs",
  lua: ".lua",
  shell: ".sh",
  sql: ".sql",
  html: ".html",
  css: ".css",
  // add more file extensions here, make sure the key is same as language prop in CodeBlock.tsx component
};

export const generateRandomString = (length: number, lowercase = false) => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXY3456789"; // excluding similar looking characters like Z, 2, I, 1, O, 0
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return lowercase ? result.toLowerCase() : result;
};

const CodeBlock: FC<Props> = memo(({ language, value, fontSize = "sm" }) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 });

  const downloadAsFile = () => {
    if (typeof window === "undefined") {
      return;
    }
    const fileExtension = programmingLanguages[language] || ".file";
    const suggestedFileName = `file-${generateRandomString(
      3,
      true
    )}${fileExtension}`;
    const fileName = window.prompt("Enter file name" || "", suggestedFileName);

    if (!fileName) {
      // User pressed cancel on prompt.
      return;
    }

    const blob = new Blob([value], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = fileName;
    link.href = url;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const onCopy = () => {
    if (isCopied) return;
    copyToClipboard(value);
  };

  const fontSizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <Card className="w-full font-mono mt-2 max-w-full overflow-auto">
        <CardHeader className="flex flex-row items-center justify-between w-full bg-muted px-4 py-0">
          <span className="text-xs lowercase">{language}</span>
          <div className="flex flex-row items-center justify-center">
            <Button variant="ghost" onClick={downloadAsFile} size="icon">
              <IconDownload />
            </Button>
            <Button variant="ghost" size="icon" onClick={onCopy}>
              {isCopied ? <IconCheck /> : <IconCopy />}
            </Button>
          </div>
        </CardHeader>
        <SyntaxHighlighter
          language={language}
          style={materialDark}
          PreTag="div"
          showLineNumbers
          customStyle={{
            margin: 0,
            width: "100%",
            padding: "1.5rem 1rem",
            maxWidth: "900px",
          }}
          lineNumberStyle={{
            userSelect: "none",
          }}
          codeTagProps={{
            style: {
              fontSize: fontSizeClasses[fontSize],
              fontFamily: "var(--font-mono)",
            },
          }}
        >
          {value}
        </SyntaxHighlighter>
    </Card>
  );
});

CodeBlock.displayName = "CodeBlock";

export { CodeBlock };
