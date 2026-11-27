"use client";

import { useState } from "react";
import { Pencil, Trash2, ImageOff, Package } from "lucide-react";
import type { Group } from "@/types/group";

interface GroupCardProps {
  group: Group;
  onEdit: (group: Group) => void;
  onDelete: (group: Group) => void;
}

export default function GroupCard({ group, onEdit, onDelete }: GroupCardProps) {
  const [imgError, setImgError] = useState(false);

  const formattedDate = group.updatedAt
    ? new Date(group.updatedAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <article className="flex flex-col border border-border bg-card transition-colors hover:border-accent">
      {/* Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border bg-[#EDE8DC]">
        {group.image && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={group.image}
            alt={group.name}
            onError={() => setImgError(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-secondary">
            <ImageOff className="h-6 w-6 opacity-60" />
            <span className="text-xs">No image preview</span>
          </div>
        )}

        {/* Item count pill */}
        <div className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 border border-border bg-card/95 px-2.5 py-1 text-xs font-medium text-foreground">
          <Package className="h-3.5 w-3.5 text-accent" />
          <span>{group.itemCount ?? 0} items</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <div className="mb-1 flex items-start justify-between gap-2">
            <h2 className="!font-sans text-base font-semibold !text-foreground line-clamp-1">
              {group.name}
            </h2>
          </div>

          <p className="mb-2.5 font-mono text-xs !text-secondary truncate">
            /{group.slug}
          </p>

          <p className="text-sm !text-secondary line-clamp-2 min-h-[2.5rem] leading-relaxed">
            {group.description?.trim()
              ? group.description
              : "No description provided."}
          </p>
        </div>

        {/* Footer metadata + Actions */}
        <div className="mt-4 pt-3 border-t border-border">
          {formattedDate && (
            <p className="mb-3 text-[11px] !text-secondary">
              Updated {formattedDate}
            </p>
          )}

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => onEdit(group)}
              className="cursor-pointer inline-flex items-center justify-center gap-1.5 border border-border bg-background py-2.5 px-3 text-xs font-medium text-foreground hover:border-foreground transition-colors"
            >
              <Pencil className="h-3.5 w-3.5" />
              <span>Edit</span>
            </button>

            <button
              type="button"
              onClick={() => onDelete(group)}
              className="cursor-pointer inline-flex items-center justify-center gap-1.5 border border-red-200 bg-red-50/70 py-2.5 px-3 text-xs font-medium text-red-700 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
