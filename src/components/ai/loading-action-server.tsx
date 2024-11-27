"use server";

import { LoadingPrompt, LoadingProps } from "./loading-action";

export const LoadingPromptServer: React.FC<LoadingProps> = async ({
  message = "Loading data...",
  loaded = false,
  loadedMessage = "Data loaded successfully!",
  state = "loading",
}) => {
  return (
    <LoadingPrompt
      message={message}
      loaded={loaded}
      loadedMessage={loadedMessage}
      state={state}
    />
  );
};
