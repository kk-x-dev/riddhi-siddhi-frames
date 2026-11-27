"use client";

import { useState } from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";
import type { Group } from "@/types/group";

interface DeleteGroupModalProps {
  group: Group | null;
  onClose: () => void;
  onConfirm: (group: Group) => Promise<void>;
}

export default function DeleteGroupModal({
  group,
  onClose,
  onConfirm,
}: DeleteGroupModalProps) {
  const [deleting, setDeleting] = useState(false);

  if (!group) return null;

  const itemCount = group.itemCount ?? 0;

  async function handleConfirm() {
    if (!group) return;
    setDeleting(true);
    try {
      await onConfirm(group);
      onClose();
    } catch {
      // Error toast is already handled by parent caller
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4"
      onClick={() => !deleting && onClose()}
    >
      <div
        className="w-full border border-border bg-card sm:max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3.5 sm:px-5">
          <div className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <h3 className="!font-sans text-base font-bold !text-foreground">
              Delete Group
            </h3>
          </div>
          <button
            type="button"
            disabled={deleting}
            onClick={onClose}
            aria-label="Close modal"
            className="cursor-pointer p-1 text-secondary hover:text-foreground disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3 p-4 sm:p-5">
          <p className="text-sm !text-foreground leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="font-semibold">&ldquo;{group.name}&rdquo;</span>?
            This action cannot be undone.
          </p>

          {itemCount > 0 && (
            <div className="border border-red-200 bg-red-50 p-3">
              <p className="text-xs font-medium !text-red-700">
                Warning: {itemCount} linked{" "}
                {itemCount === 1 ? "item" : "items"} in this group will also be
                permanently deleted.
              </p>
            </div>
          )}

          <div className="flex flex-col-reverse gap-2.5 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={deleting}
              onClick={onClose}
              className="cursor-pointer w-full sm:w-auto border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:border-foreground disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={deleting}
              onClick={handleConfirm}
              className="cursor-pointer w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
            >
              {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{deleting ? "Deleting..." : "Delete Group"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
