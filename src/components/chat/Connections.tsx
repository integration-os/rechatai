import { Plus, CircleX } from "lucide-react";
import { Separator } from "../ui/separator";
import { Connection } from "@/types/connections";
import { Badge } from "../ui/badge";
import _ from "lodash";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { ModalComponent } from "../modal";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import Image from "next/image";
import { ControlledKnowledgeBase } from "../../controlled-components/ControlledKnowledgeBase";



export const ConnectionsComponent = ({
  onClick,
  connections,
  onDeleteConnection,
  isDeleting,
  isLoading,
  isOpen = false,
  setIsOpen,
  setConnectionId,
}: {
  onClick: () => void;
  connections?: Connection[];
  onDeleteConnection: () => void;
  isDeleting: boolean;
  isLoading: boolean;
  isOpen: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  setConnectionId: (id: string) => void;
}) => {
  return (
    <>
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className="text-md font-semibold">Integrations</h1>
        <Button size="xs" onClick={onClick} variant="outline">
          <Plus className="mr-1 h-3 w-3" /> Connect
        </Button>
      </div>
      <Separator />
      {isLoading && (
        <div
          className="
        flex flex-col gap-2 p-4 flex-wrap"
        >
          {[...Array(20)].map((_, index) => (
            <Skeleton key={index} className="p-4 h-10" />
          ))}
        </div>
      )}
      {!isLoading && connections?.length === 0 && (
        <div className="flex flex-col gap-5 items-center justify-center my-5">
          <Image
            alt="Empty"
            className="mx-auto w-15 h-15"
            src="/empty-state-box.svg"
            width={40}
            height={50}
          />
          <p className="text-center text-sm text-muted-foreground">
            No connections found.
          </p>
        </div>
      )}
      {!!connections?.length && !isLoading && (
        <div className="flex flex-row gap-2 p-4 flex-wrap">
          {connections?.map((connection) => (
            <Badge
              key={connection?._id}
              variant="outline"
              className="max-w-max flex items-center py-1"
            >
              <div className="flex flex-row gap-2 justify-between items-center">
                <Image
                  src={`https://assets.buildable.dev/catalog/node-templates/${_.kebabCase(connection?.platform)}.svg`}
                  alt={connection?.platform}
                  className="w-5 h-5"
                  width={20}
                  height={20}
                />
                <p className="text-md">{_.startCase(connection?.platform)}</p>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogTrigger
                    onClick={() => setConnectionId(connection?._id)}
                  >
                    <CircleX size="15" cursor="pointer" />
                  </DialogTrigger>
                  <ModalComponent
                    isLoading={isDeleting}
                    loadingTitle="Deleting..."
                    title="Delete Connection"
                    description="This action cannot be undone. This will permanently delete the connection and all associated data."
                    actionTitle="Delete"
                    onClick={onDeleteConnection}
                  />
                </Dialog>
              </div>
            </Badge>
          ))}
        </div>
      )}
      <Separator />

      <ControlledKnowledgeBase />
    </>
  );
};


