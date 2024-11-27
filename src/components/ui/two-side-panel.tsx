"use client";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "../ui/resizable";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "./separator";

interface IProps {
  left: React.ReactNode;
  right: React.ReactNode;
  defaultLayout?: number[];
}

export const TwoSidePanel = ({ left, right, defaultLayout = [80, 20] }: IProps) => {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      onLayout={(sizes: number[]) => {
        document.cookie = `react-resizable-panels:layout:chat=${JSON.stringify(
          sizes
        )}`;
      }}
      className="items-stretch"
    >
      <ResizablePanel
        minSize={defaultLayout[0]}
        maxSize={defaultLayout[0]}
        className="flex flex-col"
        defaultSize={defaultLayout[0]}
      >
        <ScrollArea className="h-[calc(100vh-103px)]">{left}</ScrollArea>
      </ResizablePanel>
      {/* <ResizableHandle  /> */}
      <Separator orientation="vertical" className="h-[calc(100vh-103px)]" />
      <ResizablePanel
        minSize={defaultLayout[1]}
        maxSize={defaultLayout[1]}
        className="flex flex-col"
        defaultSize={defaultLayout[1]}
      >
        <ScrollArea className="h-[calc(100vh-105px)]">{right}</ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
