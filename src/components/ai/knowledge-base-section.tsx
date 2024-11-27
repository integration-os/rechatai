import Image from "next/image";
import { useState, useEffect } from "react";
import _ from "lodash";
import { formatDistanceToNow } from "date-fns";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { Separator } from "../ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  CheckIcon,
  CopyIcon,
  Database,
  DotSquare,
  Eye,
  Plus,
  Rows,
  Rows4,
} from "lucide-react";
import {
  KnowledgeBase,
  KnowledgeBaseSectionProps,
} from "../../types/knowledge-base";
import { shuffle } from "lodash";
import { EnterIcon } from "@radix-ui/react-icons";
import useGlobal from "../../hooks/useGlobal";

const getDataSizeIndicator = (rowsCount: number) => {
  if (rowsCount === 1) return <DotSquare className="w-3 h-3 text-green-500" />;
  if (rowsCount <= 10) return <Rows className="w-3 h-3 text-blue-500" />;
  if (rowsCount < 100) return <Rows4 className="w-3 h-3 text-yellow-500" />;
  return <Database className="w-3 h-3 text-red-500" />;
};

interface ModelItemProps {
  model: KnowledgeBase["models"][0];
}

const ModelItem: React.FC<ModelItemProps> = ({ model }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex items-center justify-between py-1.5 px-2 rounded-sm bg-secondary/50 text-secondary-foreground text-xs hover:bg-secondary/80 transition-colors">
      <div className="flex items-center space-x-2 flex-grow">
        <span className="font-medium">{_.startCase(model.name)}</span>
        {model.rowsCount !== undefined && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="flex items-center gap-1 cursor-help text-muted-foreground">
                {getDataSizeIndicator(model.rowsCount)}
                <span>{model.rowsCount.toLocaleString()}</span>
              </span>
            </TooltipTrigger>
            <TooltipContent side="top">
              {model.rowsCount === 1 ? (
                <>
                  <p>1 item loaded</p>
                  {model.dataSnippet &&
                    typeof model.dataSnippet === "object" &&
                    "id" in model.dataSnippet && (
                      <Badge variant="secondary" className="mt-1">
                        ID: {model.dataSnippet.id}
                      </Badge>
                    )}
                </>
              ) : (
                <p>{model.rowsCount.toLocaleString()} rows loaded</p>
              )}
              <p className="text-[10px] text-muted-foreground mt-1">
                Last updated:{" "}
                {formatDistanceToNow(new Date(model.lastUpdated), {
                  addSuffix: true,
                })}
              </p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      <div className="flex items-center space-x-3">
        <span className="text-muted-foreground text-[10px]">
          {formatDistanceToNow(new Date(model.lastUpdated), {
            addSuffix: true,
          })}
        </span>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <h6 className="text-small font-semibold">
                Knowledge Base Snippet
              </h6>
              <p className="text-xs text-muted-foreground">
                This is a snippet of the data that has been loaded into the
                knowledge base for this model.
              </p>
              <pre className="text-xs overflow-auto max-h-40 bg-muted p-2 rounded">
                {JSON.stringify(model.dataSnippet, null, 2)}
              </pre>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export const KnowledgeBaseSection: React.FC<KnowledgeBaseSectionProps> = ({
  knowledgeBase,
  onRefresh,
}) => {
  return knowledgeBase.length ? (
    <>
      <Header />
      <Separator />
      <KnowledgeBaseContent
        knowledgeBase={knowledgeBase}
        onRefresh={onRefresh}
      />
    </>
  ) : (
    <></>
  );
};

const Header = () => (
  <>
    <div className="flex items-center justify-between px-4 pt-3">
      <h1 className="text-md font-semibold">AI Knowledge Base Overview</h1>
    </div>
    <div className="text-xs text-muted-foreground/70 px-4 py-1 pb-3 flex flex-row gap-2 items-center">
      <p>
        When you interface with integration data, Rechat loads relevant
        information into the knowledge base, ensuring accurate and up-to-date
        responses.
      </p>
    </div>
  </>
);

interface KnowledgeBaseContentProps {
  knowledgeBase: KnowledgeBase[];
  onRefresh: (connectionId: string, modelName: string) => void;
}

const KnowledgeBaseContent: React.FC<KnowledgeBaseContentProps> = ({
  knowledgeBase,
  onRefresh,
}) => (
  <div className="text-sm flex flex-col gap-2">
    <Accordion type="multiple">
      {knowledgeBase.map((connection, index) => (
        <AccordionItem
          key={connection.id}
          value={`item-${index + 1}`}
          className="px-4"
        >
          <AccordionTrigger>
            <div className="flex items-center w-full gap-2">
              <Image
                src={`https://assets.buildable.dev/catalog/node-templates/${_.kebabCase(connection.platform)}.svg`}
                alt={connection.platform}
                className="w-5 h-5"
                width={40}
                height={40}
              />
              <p>{_.startCase(connection.platform)}</p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-1">
            {connection.models.map((model) => (
              <ModelItem key={model.name} model={model} />
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </div>
);

const EmptyState = () => {
  const [shuffledSuggestions, setShuffledSuggestions] = useState<string[]>([]);
  const [, setSuggestions] = useGlobal(["suggestions", "selected"]);

  const allSuggestions = [
    "Load my contacts from HubSpot",
    "Get my recent Slack messages",
    "Fetch my Google Drive documents",
    "Import my Salesforce leads",
    "Retrieve my Zendesk support tickets",
    "Show my Shopify orders",
    "Get my QuickBooks invoices",
    "Load my Airtable records",
    "Import my Pipedrive deals",
    "Retrieve my Freshdesk tickets",
    "Show my BigCommerce products",
    "Get my Xero transactions",
    "Load my ActiveCampaign campaigns",
    "Fetch my Attio contacts",
    "Import my Close leads",
    "Retrieve my Clover sales data",
    "Show my Freshbooks invoices",
    "Get my Front conversations",
    "Load my Klaviyo email campaigns",
    "Import my Netsuite inventory",
    "Retrieve my OpenAI usage statistics",
    "Show my Sage Accounting reports",
    "Get my SendGrid email analytics",
    "Load my Square transactions",
    "Fetch my WooCommerce orders",
    "Import my Workable job applications",
    "Retrieve my Zoho CRM deals",
    "Show my Google Sheets data",
    "Get my Google Calendar events",
    "Load my Dropbox files",
    "Fetch my OneDrive documents",
    "Import my Anthropic API usage data",
    "Retrieve my Freshbooks expenses",
    "Show my Pipedrive activities",
    "Get my Slack channel history",
    "Load my Xero bank transactions",
    "Fetch my Zendesk chat transcripts",
    "Import my Salesforce campaign results",
  ];

  const reshuffleSuggestions = () => {
    setShuffledSuggestions(shuffle(allSuggestions).slice(0, 4));
  };

  useEffect(() => {
    reshuffleSuggestions();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 m-4 text-center">
      <div className="bg-muted/50 rounded-full p-3 mb-4">
        <Database className="w-6 h-6 text-muted-foreground/70" />
      </div>
      <h3 className="text-lg font-medium mb-2 text-foreground/80">
        Knowledge Base Ready
      </h3>
      <p className="text-sm text-muted-foreground/70 mb-4 max-w-sm">
        Ask Rechat to load specific data into the knowledge base. Try saying:
      </p>
      <div className="flex flex-col gap-1 mb-4 w-full max-w-xs">
        {shuffledSuggestions.map((suggestion, index) => (
          <div
            key={index}
            className="bg-secondary/30 text-secondary-foreground/50 text-xs py-0.5 px-2 rounded flex items-center justify-between"
          >
            <span className="truncate mr-1">{suggestion}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0"
              onClick={() => {
                setSuggestions(suggestion);
              }}
            >
              <EnterIcon className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={reshuffleSuggestions}
        className="text-xs text-muted-foreground/60 hover:text-muted-foreground/80"
      >
        Show different examples
      </Button>
    </div>
  );
};
