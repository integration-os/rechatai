import { Separator } from "../ui/separator";
import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";
import Image from "next/image";
import { useOnClickAppTemplateUx } from "@/hooks/ux/appTemplates/useOnClickAppTemplateUx";
import { Dialog } from "../ui/dialog";
import { useEffect, useState } from "react";
import { ModalComponent } from "../modal";
import { startCase } from "lodash";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "next-themes"


const AppTemplate = ({title, description, image}: {title: string, description: string, image: string}) => {

  const { theme } = useTheme();

  return (
    <Card className="w-full max-w-md overflow-hidden bg-white dark:bg-black cursor-pointer">
      <CardHeader className="space-y-1 p-2">
        <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</CardTitle>
        <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      </CardHeader>
      <CardContent className="p-2">
        <div className="overflow-hidden rounded-lg border bg-gray-50 dark:bg-gray-900 shadow-sm">
          <div className="relative aspect-video w-full">
            <Image
            style={{
              filter: theme === 'dark' ? 'invert(1) hue-rotate(180deg)' : 'none'
            }}
              src={image}
              alt={image}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export const AppTemplates = () => {
  const appTemplates = useQuery(api.appTemplates.listAppTemplates);

  const { trigger, unconnectedPlatforms } = useOnClickAppTemplateUx();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(unconnectedPlatforms.length > 0);
  }, [unconnectedPlatforms]);

  const formatUnconnectedPlatforms = (platforms: string[]) => {
    switch (platforms.length) {
      case 1:
        return startCase(platforms[0]);
      case 2:
        return `${startCase(platforms[0])} and ${startCase(platforms[1])}`;
      default:
        const last = platforms.pop();
        return `${platforms.map((platform) => startCase(platform)).join(", ")}, and ${startCase(last)}`;
    }
  };

  return (
    <>
      <div className="flex flex-col w-full px-4 mt-4 mb-6">
        <h1 className="text-md font-semibold">Start from a template</h1>
        {appTemplates?.length === 0 && (
            <div className="flex flex-col gap-5 items-center justify-center my-5">
              <Image
                alt="Empty"
                className="mx-auto w-15 h-15"
                src="/empty-state-box.svg"
                width={40}
                height={50}
              />
              <p className="text-center text-sm text-muted-foreground">
                No app templates found.
              </p>
            </div>
          )}
        <div
          className={`mt-4 grid grid-cols-2 gap-2 px-4 sm:px-0`}
        >
          {appTemplates?.map((appTemplate) => (
            <div
              onClick={() => trigger(appTemplate)}
              key={appTemplate._id}
            >
              <AppTemplate
                title={appTemplate.title}
                description={appTemplate.description || ""}
                image={appTemplate.image}
              />
            </div>
          ))}
        </div>
      </div>
      <Separator />
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <ModalComponent
          isLoading={false}
          loadingTitle=""
          variant="default"
          title="This template requires an integration"
          description={`To use this template, you'll need to integrate ${formatUnconnectedPlatforms(unconnectedPlatforms)}. Add the missing integration in Rechat and try again.`}
          actionTitle="Got it"
          onClick={() => setIsOpen(false)}
        />
      </Dialog>
    </>
  );
};
