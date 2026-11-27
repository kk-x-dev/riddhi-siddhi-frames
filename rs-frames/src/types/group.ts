export interface Group {
  _id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  itemCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateGroupPayload {
  name: string;
  description: string;
  image: string;
}

export interface UpdateGroupPayload {
  name?: string;
  description?: string;
  image?: string;
}

export interface DeleteGroupResponse {
  ok: boolean;
  message: string;
  deletedGroupId: string;
  deletedItemsCount: number;
}
