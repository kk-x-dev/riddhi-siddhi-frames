"use client";

import { useState, FormEvent } from "react";
import { X, Loader2, ImageOff } from "lucide-react";
import toast from "react-hot-toast";
import ImageUploader from "@/components/ImageUploader";
import type {
  CreateGroupPayload,
  Group,
  UpdateGroupPayload,
} from "@/types/group";

interface GroupFormModalProps {
  mode: "create" | "edit";
  initialGroup: Group | null;
  onClose: () => void;
  onCreate: (payload: CreateGroupPayload) => Promise<void>;
  onUpdate: (id: string, payload: UpdateGroupPayload) => Promise<void>;
}

function toPreviewSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function GroupFormModal({
  mode,
  initialGroup,
  onClose,
  onCreate,
  onUpdate,
}: GroupFormModalProps) {
  const [name, setName] = useState(
    mode === "edit" && initialGroup ? initialGroup.name : ""
  );
  const [description, setDescription] = useState(
    mode === "edit" && initialGroup ? initialGroup.description ?? "" : ""
  );
  const [image, setImage] = useState(
    mode === "edit" && initialGroup ? initialGroup.image ?? "" : ""
  );
  const [imgPreviewError, setImgPreviewError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const previewSlug = toPreviewSlug(name);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedImage = image.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      toast.error("Group name is required.");
      return;
    }

    if (!toPreviewSlug(trimmedName)) {
      toast.error("Group name must contain letters or numbers (A-Z, 0-9).");
      return;
    }

    if (!trimmedImage) {
      toast.error("Please upload a group image first.");
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "create") {
        await onCreate({
          name: trimmedName,
          description: trimmedDescription,
          image: trimmedImage,
        });
      } else if (initialGroup) {
        await onUpdate(initialGroup._id, {
          name: trimmedName,
          description: trimmedDescription,
          image: trimmedImage,
        });
      }
      onClose();
    } catch {
      // Error toast is already handled by parent caller
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4"
      onClick={() => !submitting && onClose()}
    >
      <div
        className="w-full max-h-[92vh] overflow-y-auto border border-border bg-card sm:max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-4 py-4 sm:px-6">
          <div>
            <h2 className="!font-sans text-base font-bold !text-foreground sm:text-lg">
              {mode === "create" ? "Create New Group" : "Edit Group"}
            </h2>
            <p className="text-xs !text-secondary mt-0.5">
              {mode === "create"
                ? "Add a new category group to your catalog"
                : `Updating "${initialGroup?.name}"`}
            </p>
          </div>
          <button
            type="button"
            disabled={submitting}
            onClick={onClose}
            aria-label="Close modal"
            className="cursor-pointer p-1.5 text-secondary hover:text-foreground disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 p-4 sm:p-6">
          {/* Group Name */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Group Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Wooden Devotional Frames"
              disabled={submitting}
              className="w-full border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-secondary focus:border-accent focus:outline-none disabled:opacity-60"
            />
            {name.trim() && (
              <p className="mt-1.5 font-mono text-xs !text-secondary">
                Slug:{" "}
                <span className="text-foreground">
                  {previewSlug ? `/${previewSlug}` : "(requires A-Z or 0-9)"}
                </span>
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description about this group..."
              disabled={submitting}
              className="w-full resize-none border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-secondary focus:border-accent focus:outline-none disabled:opacity-60"
            />
          </div>

          {/* Image Upload & Preview */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Group Image <span className="text-red-600">*</span>
            </label>

            <div className="space-y-3 border border-border bg-background p-3.5">
              {image ? (
                <div className="flex items-start gap-3.5">
                  <div className="h-20 w-20 shrink-0 overflow-hidden border border-border bg-[#EDE8DC]">
                    {!imgPreviewError ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={image}
                        alt="Group preview"
                        onError={() => setImgPreviewError(true)}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-secondary">
                        <ImageOff className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <p className="truncate text-xs !text-secondary">{image}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <ImageUploader
                        value={image}
                        onChange={(url) => {
                          setImage(url);
                          setImgPreviewError(false);
                          toast.success("Image uploaded!");
                        }}
                        folder="frames-store/groups"
                        showUrl={false}
                      />
                      <button
                        type="button"
                        onClick={() => setImage("")}
                        disabled={submitting}
                        className="cursor-pointer border border-border bg-card px-3 py-2 text-xs font-medium text-red-700 hover:border-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4 text-center">
                  <p className="mb-3 text-xs !text-secondary">
                    Upload a cover image via Cloudinary (JPG, PNG, WEBP, AVIF)
                  </p>
                  <ImageUploader
                    value={image}
                    onChange={(url) => {
                      setImage(url);
                      setImgPreviewError(false);
                      toast.success("Image uploaded!");
                    }}
                    folder="frames-store/groups"
                    label="Upload Group Image"
                    showUrl={false}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-2.5 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={submitting}
              onClick={onClose}
              className="cursor-pointer w-full sm:w-auto border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground hover:border-foreground disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="cursor-pointer w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-btn px-6 py-2.5 text-sm font-medium text-btn-text hover:bg-foreground disabled:opacity-60"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>
                {submitting
                  ? mode === "create"
                    ? "Creating..."
                    : "Saving..."
                  : mode === "create"
                  ? "Create Group"
                  : "Save Changes"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
