import { DynamicComponent } from "./dynamic-component";

export const DynamicServerComponent = async ({
  id,
  code,
  title,
  description,
  prompt,
  platformsUsed,
  addOrRemove = "add",
}: {
  id?: string;
  code: string;
  title: string;
  description?: string;
  addOrRemove: "add" | "remove";
  prompt: string;
  platformsUsed?: {
    platform: string;
    connectionKey: string;
    models: string[];
  }[];
}) => {
  "use server";
  return (
    <>
      <DynamicComponent
        id={id}
        code={code}
        title={title}
        description={description}
        prompt={prompt}
        platformsUsed={platformsUsed}
        addOrRemove={addOrRemove}
      />
    </>
  );
};
