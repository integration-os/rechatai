"use server";

import AdvancedTable from "./advanced-table";

export const AdvancedTableServer = ({
  connectionKey,
  model,
}: {
  connectionKey: string;
  model: string;
}) => {
  return (
    <div>
      <AdvancedTable connectionKey={connectionKey} model={model} />
    </div>
  );
};
