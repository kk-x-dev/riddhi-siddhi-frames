import type {
  CreateGroupPayload,
  DeleteGroupResponse,
  Group,
  UpdateGroupPayload,
} from "@/types/group";

interface ApiErrorShape {
  ok?: boolean;
  error?: string;
}

async function parseJsonSafe<T>(res: Response): Promise<T & ApiErrorShape> {
  try {
    return (await res.json()) as T & ApiErrorShape;
  } catch {
    throw new Error("Server returned an invalid response.");
  }
}

export async function fetchGroups(): Promise<Group[]> {
  const res = await fetch("/api/groups", { cache: "no-store" });
  const data = await parseJsonSafe<{ groups?: Group[] }>(res);

  if (!res.ok || !data.ok || !Array.isArray(data.groups)) {
    throw new Error(data.error || "Failed to load groups.");
  }

  return data.groups;
}

export async function createGroup(payload: CreateGroupPayload): Promise<Group> {
  const res = await fetch("/api/groups", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await parseJsonSafe<{ group?: Group }>(res);

  if (!res.ok || !data.ok || !data.group) {
    throw new Error(data.error || "Failed to create group.");
  }

  return data.group;
}

export async function updateGroup(
  id: string,
  payload: UpdateGroupPayload
): Promise<Group> {
  const res = await fetch(`/api/groups/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await parseJsonSafe<{ group?: Group }>(res);

  if (!res.ok || !data.ok || !data.group) {
    throw new Error(data.error || "Failed to update group.");
  }

  return data.group;
}

export async function deleteGroup(id: string): Promise<DeleteGroupResponse> {
  const res = await fetch(`/api/groups/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });

  const data = await parseJsonSafe<DeleteGroupResponse>(res);

  if (!res.ok || !data.ok) {
    throw new Error(data.error || "Failed to delete group.");
  }

  return data;
}
