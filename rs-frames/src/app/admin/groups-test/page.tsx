"use client";

import { useState, useEffect, FormEvent } from "react";
import ImageUploader from "@/components/ImageUploader";

interface GroupItem {
  _id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
}

export default function GroupsBrowserTestPage() {
  // Create state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [createStatus, setCreateStatus] = useState("");
  const [createError, setCreateError] = useState("");
  const [submittingCreate, setSubmittingCreate] = useState(false);

  // Existing groups list + Update state
  const [groups, setGroups] = useState<GroupItem[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImage, setEditImage] = useState("");
  const [updateStatus, setUpdateStatus] = useState("");
  const [updateError, setUpdateError] = useState("");
  const [submittingUpdate, setSubmittingUpdate] = useState(false);

  // Latest API JSON response preview
  const [lastResponse, setLastResponse] = useState<unknown>(null);

  async function loadGroups(preferredId?: string) {
    try {
      const res = await fetch("/api/groups", { cache: "no-store" });
      const data = await res.json();
      if (res.ok && data.ok && Array.isArray(data.groups)) {
        setGroups(data.groups);
        const target =
          data.groups.find((g: GroupItem) => g._id === preferredId) ??
          data.groups.find((g: GroupItem) => g._id === selectedId) ??
          data.groups[0];

        if (target) {
          selectGroupForEdit(target);
        }
      }
    } catch {
      // Ignore load errors during initial mount
    }
  }

  function selectGroupForEdit(group: GroupItem) {
    setSelectedId(group._id);
    setEditName(group.name);
    setEditDescription(group.description ?? "");
    setEditImage(group.image ?? "");
    setUpdateStatus("");
    setUpdateError("");
  }

  useEffect(() => {
    loadGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSelectChange(id: string) {
    setSelectedId(id);
    const found = groups.find((g) => g._id === id);
    if (found) {
      setEditName(found.name);
      setEditDescription(found.description ?? "");
      setEditImage(found.image ?? "");
      setUpdateStatus("");
      setUpdateError("");
    }
  }

  async function handleCreateSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCreateError("");
    setCreateStatus("");

    if (!image) {
      setCreateError("Upload an image with Cloudinary first.");
      return;
    }

    setSubmittingCreate(true);
    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, image }),
      });

      const data = await res.json();
      setLastResponse(data);

      if (!res.ok || !data.ok) {
        setCreateError(data.error || "Failed to create group.");
        return;
      }

      setCreateStatus("Created group in MongoDB.");
      setName("");
      setDescription("");
      setImage("");
      await loadGroups(data.group?._id);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Network error");
    } finally {
      setSubmittingCreate(false);
    }
  }

  async function handleUpdateSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUpdateError("");
    setUpdateStatus("");

    if (!selectedId.trim()) {
      setUpdateError("Select a group or enter a valid Group ID.");
      return;
    }

    setSubmittingUpdate(true);
    try {
      const payload: {
        name?: string;
        description?: string;
        image?: string;
      } = {};

      if (editName.trim()) payload.name = editName.trim();
      payload.description = editDescription;
      if (editImage.trim()) payload.image = editImage.trim();

      const res = await fetch(`/api/groups/${selectedId.trim()}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setLastResponse(data);

      if (!res.ok || !data.ok) {
        setUpdateError(data.error || "Failed to update group.");
        return;
      }

      setUpdateStatus("Updated group in MongoDB.");
      await loadGroups(selectedId.trim());
    } catch (err) {
      setUpdateError(err instanceof Error ? err.message : "Network error");
    } finally {
      setSubmittingUpdate(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl space-y-8 p-6">
      <h1 className="text-xl font-semibold">Browser Test: Groups POST &amp; PATCH</h1>

      {/* 1. CREATE FORM */}
      <form onSubmit={handleCreateSubmit} className="space-y-4 rounded border p-4">
        <h2 className="text-base font-semibold">1. Create Group (POST /api/groups)</h2>

        <div>
          <label className="block text-sm font-medium">Group Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Wooden Frames"
            className="mt-1 w-full rounded border px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Handcrafted oak and walnut frames"
            className="mt-1 w-full rounded border px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Group Image</label>
          <ImageUploader
            value={image}
            onChange={(url) => setImage(url)}
            folder="frames-store/groups"
          />
        </div>

        {image && (
          <img
            src={image}
            alt="New group preview"
            className="h-28 w-28 rounded border object-cover"
          />
        )}

        <button
          type="submit"
          disabled={submittingCreate}
          className="rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          {submittingCreate ? "Creating..." : "Create Group"}
        </button>

        {createStatus && <p className="text-sm text-green-700">{createStatus}</p>}
        {createError && <p className="text-sm text-red-600">{createError}</p>}
      </form>

      {/* 2. UPDATE FORM */}
      <form onSubmit={handleUpdateSubmit} className="space-y-4 rounded border p-4">
        <h2 className="text-base font-semibold">2. Update Group (PATCH /api/groups/[id])</h2>

        <div>
          <label className="block text-sm font-medium">Pick Existing Group</label>
          <select
            value={selectedId}
            onChange={(e) => handleSelectChange(e.target.value)}
            className="mt-1 w-full rounded border px-3 py-2 text-sm"
          >
            <option value="">-- Select a group --</option>
            {groups.map((g) => (
              <option key={g._id} value={g._id}>
                {g.name} ({g._id})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Group ID</label>
          <input
            type="text"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            placeholder="Paste MongoDB ObjectId"
            className="mt-1 w-full rounded border px-3 py-2 font-mono text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Updated Name</label>
          <input
            type="text"
            required
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="mt-1 w-full rounded border px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Updated Description</label>
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="mt-1 w-full rounded border px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Updated Image</label>
          <ImageUploader
            value={editImage}
            onChange={(url) => setEditImage(url)}
            folder="frames-store/groups"
            label="Replace Image"
          />
        </div>

        {editImage && (
          <img
            src={editImage}
            alt="Updated group preview"
            className="h-28 w-28 rounded border object-cover"
          />
        )}

        <button
          type="submit"
          disabled={submittingUpdate}
          className="rounded bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          {submittingUpdate ? "Updating..." : "Update Group"}
        </button>

        {updateStatus && <p className="text-sm text-green-700">{updateStatus}</p>}
        {updateError && <p className="text-sm text-red-600">{updateError}</p>}
      </form>

      {/* LATEST RESPONSE */}
      {lastResponse !== null && (
        <div className="space-y-1">
          <h3 className="text-sm font-medium">Latest API Response</h3>
          <pre className="overflow-x-auto rounded bg-neutral-100 p-3 text-xs">
            {JSON.stringify(lastResponse, null, 2)}
          </pre>
        </div>
      )}
    </main>
  );
}