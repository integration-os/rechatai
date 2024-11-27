export interface KnowledgeBase {
  id: string;
  platform: string;
  models: {
    name: string;
    rowsCount: number;
    lastUpdated: number; // Add this line
    dataSnippet: any; // Add this line
  }[];
}

export interface KnowledgeBaseSectionProps {
  knowledgeBase: KnowledgeBase[];
  onRefresh: (connectionId: string) => void; // Add this prop for refresh functionality
}
