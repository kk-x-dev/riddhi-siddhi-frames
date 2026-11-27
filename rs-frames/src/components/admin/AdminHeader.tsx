"use client";

import Link from "next/link";
import { ArrowLeft, Plus, RefreshCw, Layers } from "lucide-react";

interface AdminHeaderProps {
  totalGroups: number;
  loading: boolean;
  onRefresh: () => void;
  onCreateClick: () => void;
}

export default function AdminHeader({
  totalGroups,
  loading,
  onRefresh,
  onCreateClick,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur-sm">
      <div className="mx-auto max-w-[1280px] px-4 py-3.5 md:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Left: Brand & Back link */}
          <div className="flex items-start justify-between gap-3 sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1 text-xs font-medium text-secondary hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Storefront</span>
                </Link>
                <span className="text-border">/</span>
                <span className="text-xs font-medium text-accent">Admin</span>
              </div>

              <div className="mt-1 flex items-center gap-2.5">
                <Layers className="h-5 w-5 text-accent-secondary shrink-0" />
                <h1 className="!font-sans text-lg font-bold tracking-tight !text-foreground sm:text-xl">
                  Catalog Groups
                </h1>
                <span className="border border-border bg-background px-2 py-0.5 text-xs font-medium text-secondary">
                  {totalGroups}
                </span>
              </div>
            </div>

            {/* Mobile quick refresh button */}
            <button
              type="button"
              onClick={onRefresh}
              disabled={loading}
              aria-label="Refresh groups"
              className="cursor-pointer sm:hidden border border-border bg-background p-2 text-foreground hover:border-foreground disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
            </button>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onRefresh}
              disabled={loading}
              className="cursor-pointer hidden sm:inline-flex items-center gap-2 border border-border bg-background px-3.5 py-2 text-sm font-medium text-foreground hover:border-foreground transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={onCreateClick}
              className="cursor-pointer flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-btn px-4 py-2.5 sm:py-2 text-sm font-medium text-btn-text hover:bg-foreground transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>New Group</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
