const { nanoid } = require("nanoid");

const applicationNamespace = {
  session: "sess",
  user: "usr",
  app: "app",
} as const;

export type IdsNamespaces = keyof typeof applicationNamespace;

export const generateId = (namespace: IdsNamespaces) =>
  `${applicationNamespace[namespace]}_${nanoid(26)}`;
