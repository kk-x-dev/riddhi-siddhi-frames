"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { Search, X, Plus, FolderOpen, AlertCircle } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import GroupCard from "@/components/admin/GroupCard";
import GroupFormModal from "@/components/admin/GroupFormModal";
import DeleteGroupModal from "@/components/admin/DeleteGroupModal";
import {
  fetchGroups,
  createGroup,
  updateGroup,
  deleteGroup,
} from "@/lib/api/groups";
import type {
  CreateGroupPayload,
  Group,
  UpdateGroupPayload,
} from "@/types/group";

export default function AdminCatalogPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal state
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [deletingGroup, setDeletingGroup] = useState<Group | null>(null);

  const loadAllGroups = useCallback(async (showToastOnError = true) => {
    setLoading(true);
    setLoadError("");
    try {
      const data = await fetchGroups();
      setGroups(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load groups.";
      setLoadError(message);
      if (showToastOnError) {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function init() {
      try {
        const data = await fetchGroups();
        if (!active) return;
        setGroups(data);
        setLoadError("");
      } catch (err) {
        if (!active) return;
        const message =
          err instanceof Error ? err.message : "Failed to load groups.";
        setLoadError(message);
        toast.error(message);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void init();
    return () => {
      active = false;
    };
  }, []);

  const filteredGroups = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return groups;
    return groups.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.slug.toLowerCase().includes(q) ||
        (g.description ?? "").toLowerCase().includes(q)
    );
  }, [groups, searchQuery]);

  function openCreateModal() {
    setFormMode("create");
    setEditingGroup(null);
    setFormOpen(true);
  }

  function openEditModal(group: Group) {
    setFormMode("edit");
    setEditingGroup(group);
    setFormOpen(true);
  }

  async function handleCreate(payload: CreateGroupPayload) {
    const toastId = toast.loading("Creating group...");
    try {
      const created = await createGroup(payload);
      setGroups((prev) => [{ ...created, itemCount: 0 }, ...prev]);
      toast.success(`"${created.name}" created!`, { id: toastId });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create group.";
      toast.error(message, { id: toastId });
      throw err;
    }
  }

  async function handleUpdate(id: string, payload: UpdateGroupPayload) {
    const toastId = toast.loading("Saving changes...");
    try {
      const updated = await updateGroup(id, payload);
      setGroups((prev) =>
        prev.map((g) =>
          g._id === id ? { ...updated, itemCount: g.itemCount ?? 0 } : g
        )
      );
      toast.success(`"${updated.name}" updated!`, { id: toastId });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update group.";
      toast.error(message, { id: toastId });
      throw err;
    }
  }

  async function handleDelete(group: Group) {
    const toastId = toast.loading(`Deleting "${group.name}"...`);
    try {
      const res = await deleteGroup(group._id);
      setGroups((prev) => prev.filter((g) => g._id !== group._id));
      const extra =
        res.deletedItemsCount > 0
          ? ` (${res.deletedItemsCount} linked item${
              res.deletedItemsCount === 1 ? "" : "s"
            } removed)`
          : "";
      toast.success(`"${group.name}" deleted${extra}.`, { id: toastId });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete group.";
      toast.error(message, { id: toastId });
      throw err;
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader
        totalGroups={groups.length}
        loading={loading}
        onRefresh={() => loadAllGroups(true)}
        onCreateClick={openCreateModal}
      />

      <main className="mx-auto max-w-[1280px] px-4 py-6 md:px-6 md:py-8 lg:px-8">
        {/* Search Bar */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search groups by name or slug..."
              className="w-full border border-border bg-card py-2.5 pl-9 pr-9 text-sm text-foreground placeholder:text-secondary focus:border-accent focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="cursor-pointer absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-secondary hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {!loading && !loadError && groups.length > 0 && (
            <p className="text-xs !text-secondary">
              Showing {filteredGroups.length} of {groups.length}{" "}
              {groups.length === 1 ? "group" : "groups"}
            </p>
          )}
        </div>

        {/* Error State */}
        {loadError && !loading && (
          <div className="border border-red-200 bg-card p-6 text-center">
            <AlertCircle className="mx-auto mb-2.5 h-7 w-7 text-red-600" />
            <h2 className="!font-sans text-base font-semibold !text-foreground">
              Could not load catalog groups
            </h2>
            <p className="mt-1 text-sm !text-secondary">{loadError}</p>
            <button
              type="button"
              onClick={() => loadAllGroups(true)}
              className="cursor-pointer mt-4 bg-btn px-5 py-2 text-sm font-medium text-btn-text hover:bg-foreground"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="border border-border bg-card animate-pulse"
              >
                <div className="aspect-[16/10] w-full bg-[#EDE8DC]" />
                <div className="space-y-3 p-4">
                  <div className="h-5 w-2/3 bg-[#EDE8DC]" />
                  <div className="h-3 w-1/3 bg-[#EDE8DC]" />
                  <div className="h-8 w-full bg-[#EDE8DC]" />
                  <div className="grid grid-cols-2 gap-2.5 pt-2">
                    <div className="h-9 bg-[#EDE8DC]" />
                    <div className="h-9 bg-[#EDE8DC]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State (no groups at all) */}
        {!loading && !loadError && groups.length === 0 && (
          <div className="border border-dashed border-border bg-card px-6 py-16 text-center">
            <FolderOpen className="mx-auto mb-3 h-10 w-10 text-secondary opacity-70" />
            <h2 className="!font-sans text-lg font-semibold !text-foreground">
              No catalog groups yet
            </h2>
            <p className="mx-auto mt-1.5 max-w-md text-sm !text-secondary">
              Create your first group to start organizing your devotional photo
              frames catalog.
            </p>
            <button
              type="button"
              onClick={openCreateModal}
              className="cursor-pointer mt-6 inline-flex items-center gap-2 bg-btn px-5 py-2.5 text-sm font-medium text-btn-text hover:bg-foreground"
            >
              <Plus className="h-4 w-4" />
              <span>Create First Group</span>
            </button>
          </div>
        )}

        {/* Empty Search State */}
        {!loading &&
          !loadError &&
          groups.length > 0 &&
          filteredGroups.length === 0 && (
            <div className="border border-border bg-card px-6 py-12 text-center">
              <p className="text-sm !text-secondary">
                No groups match &ldquo;{searchQuery}&rdquo;.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="cursor-pointer mt-3 border border-border bg-background px-4 py-2 text-xs font-medium text-foreground hover:border-foreground"
              >
                Clear Search
              </button>
            </div>
          )}

        {/* Groups Grid */}
        {!loading && !loadError && filteredGroups.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
            {filteredGroups.map((group) => (
              <GroupCard
                key={group._id}
                group={group}
                onEdit={openEditModal}
                onDelete={(g) => setDeletingGroup(g)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Create / Edit Modal */}
      {formOpen && (
        <GroupFormModal
          key={
            formMode === "edit" && editingGroup
              ? `edit-${editingGroup._id}`
              : "create"
          }
          mode={formMode}
          initialGroup={editingGroup}
          onClose={() => setFormOpen(false)}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteGroupModal
        group={deletingGroup}
        onClose={() => setDeletingGroup(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
