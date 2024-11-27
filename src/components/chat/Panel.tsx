"use client";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "../ui/resizable";
import { ScrollArea } from "../ui/scroll-area";

interface IProps {
  left: React.ReactNode;
  right: React.ReactNode;
  center: React.ReactNode;
  defaultLayout: number[];
}

export const Panel = ({
  left,
  right,
  center,
  defaultLayout = [15, 70, 15],
}: IProps) => {
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
        minSize={5}
        maxSize={20}
        className="flex flex-col"
        defaultSize={defaultLayout[0]}
      >
        <ScrollArea className="h-[calc(100vh-105px)]">{left}</ScrollArea>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel
        minSize={30}
        className="flex flex-col"
        defaultSize={defaultLayout[1]}
      >
        {center}
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel
        minSize={5}
        maxSize={25}
        className="flex flex-col"
        defaultSize={defaultLayout[2]}
      >
        <ScrollArea className="h-[calc(100vh-105px)]">{right}</ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
