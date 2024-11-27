import { BuildingUiPending } from "./building-ui-pending";

export const BuildingUiPendingServer = async () => {
  "use server";
  return (
    <>
      <BuildingUiPending />
    </>
  );
};
