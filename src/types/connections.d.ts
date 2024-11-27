export interface Connection {
  _id: Id<"connections">;
  _creationTime: number;
  userId: string;
  key: string;
  platform: string;
  ownerId?: string;
}
