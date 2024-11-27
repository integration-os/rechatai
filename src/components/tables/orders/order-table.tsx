"use server";

import { columns } from "./columns";
import { DataTable } from "./data-table";

export const OrderTable = ({orders}: any) => {
  return <DataTable columns={columns} data={orders} />;
};
